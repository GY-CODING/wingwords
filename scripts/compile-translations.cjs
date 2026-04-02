#!/usr/bin/env node
/**
 * Script para compilar archivos .lang.ts a archivos .json finales
 * con traducción automática vía MyMemory (100% gratuito, sin registro).
 *
 * Uso:
 *   node scripts/compile-translations.cjs           # compila + traduce automáticamente
 *   node scripts/compile-translations.cjs --no-ai   # compila sin traducción automática
 *
 * Qué hace:
 * 1. Busca todos los archivos .lang.ts en src/
 * 2. Extrae los mensajes de defineMessages (id y defaultMessage)
 * 3. Genera/actualiza en.json con los defaultMessage
 * 4. Para cada otro locale: traduce AUTOMÁTICAMENTE las claves nuevas con MyMemory API
 * 5. Nunca borra traducciones ya existentes y correctas
 *
 * MyMemory: https://mymemory.translated.net/
 * Sin API key, sin tarjeta. Límite: 10K palabras/día (más que suficiente para UI strings).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const localesConfig = require('./locales.config.cjs');

// Intentar cargar .env.local (sin dependencia de dotenv)
function loadEnvFile() {
  const envFiles = ['.env.local', '.env'];
  for (const envFile of envFiles) {
    const envPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
      break;
    }
  }
}

loadEnvFile();

const SRC_DIR = path.join(__dirname, '../src');
const SUPPORTED_LOCALES = localesConfig.supportedLocales;
const SOURCE_LOCALE = localesConfig.defaultLocale;
const USE_AI = !process.argv.includes('--no-ai');

// Mapeo de códigos de idioma al formato langpair de MyMemory ("en|es")
const MYMEMORY_LOCALE_MAP = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  nl: 'nl',
  pl: 'pl',
  ru: 'ru',
  zh: 'zh',
  ja: 'ja',
};

// ─── HTTP helper ─────────────────────────────────────────────────────────────
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data),
        });
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ─── MyMemory translation ────────────────────────────────────────────────────
/**
 * Traduce un texto con MyMemory API (sin key, sin registro).
 * Devuelve el texto traducido o null si falla.
 */
async function translateWithMyMemory(text, sourceLang, targetLang) {
  const langpair = encodeURIComponent(`${sourceLang}|${targetLang}`);
  const q = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}`;

  try {
    const response = await httpRequest(url, { method: 'GET' });
    if (!response.ok) return null;

    const data = await response.json();
    // responseStatus 200 = ok; 429 = rate limit
    if (data?.responseStatus !== 200) return null;

    const translated = data?.responseData?.translatedText;
    // MyMemory devuelve en mayúsculas si no reconoce el idioma — descartamos ese caso
    if (!translated || translated === text.toUpperCase()) return null;

    return translated;
  } catch (err) {
    return null;
  }
}

/**
 * Traduce un mapa { id: textoIngles } al locale destino.
 * Devuelve { id: textoTraducido } o null si todos fallan.
 */
async function translateBatch(textsMap, targetLocale) {
  const sourceLang = MYMEMORY_LOCALE_MAP[SOURCE_LOCALE] || SOURCE_LOCALE;
  const targetLang = MYMEMORY_LOCALE_MAP[targetLocale] || targetLocale;
  const entries = Object.entries(textsMap);
  const result = {};
  let ok = 0;

  for (const [id, text] of entries) {
    // Skip auto-translation if the text contains {placeholders} — MyMemory
    // tends to strip or corrupt interpolation variables like {title} or {author}.
    if (/\{[a-zA-Z_]\w*\}/.test(text)) {
      // Leave the key untranslated so it stays in EN (will fallback to defaultMessage)
      continue;
    }
    const translation = await translateWithMyMemory(text, sourceLang, targetLang);
    if (translation) {
      result[id] = translation;
      ok++;
    }
    // Pausa para no superar el rate limit de MyMemory
    await new Promise((r) => setTimeout(r, 300));
  }

  return ok > 0 ? result : null;
}

// ─── .lang.ts parser ─────────────────────────────────────────────────────────
function findLangFiles(dir) {
  const results = [];
  function search(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) search(full);
      else if (entry.isFile() && entry.name.endsWith('.lang.ts')) results.push(full);
    }
  }
  search(dir);
  return results;
}

function extractMessages(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const messages = {};
  const re = /\w+:\s*\{\s*id:\s*["']([^"']+)["'],\s*defaultMessage:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    messages[m[1]] = m[2];
  }
  return messages;
}

// ─── Core compiler ────────────────────────────────────────────────────────────
async function compileDirectory(langFiles, localesDir) {
  const relDir = path.relative(SRC_DIR, localesDir);
  console.log(`\n📁 ${relDir}`);

  // Recopilar todos los mensajes
  const allMessages = {};
  for (const file of langFiles) {
    console.log(`   📄 ${path.basename(file)}`);
    Object.assign(allMessages, extractMessages(file));
  }

  const ids = Object.keys(allMessages);
  console.log(`   🔑 ${ids.length} claves encontradas`);
  if (ids.length === 0) return;

  // ── Idioma fuente (en.json) ────────────────────────────────────────────────
  const sourceFile = path.join(localesDir, `${SOURCE_LOCALE}.json`);
  const existingSource = fs.existsSync(sourceFile)
    ? JSON.parse(fs.readFileSync(sourceFile, 'utf8'))
    : {};

  const sourceMessages = {};
  let sourceAdded = 0;
  let sourceRemoved = 0;

  for (const id of ids) {
    sourceMessages[id] = allMessages[id]; // siempre actualizar con defaultMessage
    if (!existingSource[id]) sourceAdded++;
  }
  for (const id of Object.keys(existingSource)) {
    if (!allMessages[id]) sourceRemoved++;
  }

  fs.writeFileSync(sourceFile, JSON.stringify(sourceMessages, null, 2) + '\n', 'utf8');
  console.log(`   ✅ ${SOURCE_LOCALE}.json actualizado${sourceAdded ? ` (+${sourceAdded})` : ''}${sourceRemoved ? ` (-${sourceRemoved} obsoletas)` : ''}`);

  // ── Idiomas de traducción ──────────────────────────────────────────────────
  for (const locale of localesConfig.translationLocales) {
    const localeFile = path.join(localesDir, `${locale}.json`);
    const existing = fs.existsSync(localeFile)
      ? JSON.parse(fs.readFileSync(localeFile, 'utf8'))
      : {};

    // Determinar qué claves son nuevas o tienen [PENDING]
    const toTranslate = {};
    for (const id of ids) {
      const current = existing[id];
      const isNew = !current;
      const isPending = typeof current === 'string' && current.startsWith('[PENDING]');
      if (isNew || isPending) {
        toTranslate[id] = allMessages[id]; // texto en inglés
      }
    }

    if (Object.keys(toTranslate).length === 0) {
      // Eliminar claves obsoletas si las hay
      const cleaned = {};
      for (const id of ids) cleaned[id] = existing[id];
      fs.writeFileSync(localeFile, JSON.stringify(cleaned, null, 2) + '\n', 'utf8');
      console.log(`   ✅ ${locale}.json sin cambios`);
      continue;
    }

    console.log(`   🌍 ${locale}.json: ${Object.keys(toTranslate).length} claves nuevas/pendientes`);

    let translated = null;
    if (USE_AI) {
      process.stdout.write(`      🌐 Traduciendo con MyMemory (${Object.keys(toTranslate).length} claves)...`);
      translated = await translateBatch(toTranslate, locale);
      if (translated) {
        console.log(` ✅ ${Object.keys(translated).length}/${Object.keys(toTranslate).length} traducidas`);
      } else {
        console.log(` ❌ falló, usando [PENDING]`);
      }
    }

    // Construir nuevo archivo de locale
    const newLocale = {};
    const addedCount = { ai: 0, pending: 0, kept: 0 };

    for (const id of ids) {
      if (toTranslate[id]) {
        if (translated && translated[id]) {
          newLocale[id] = translated[id];
          addedCount.ai++;
        } else {
          newLocale[id] = `[PENDING] ${allMessages[id]}`;
          addedCount.pending++;
        }
      } else {
        newLocale[id] = existing[id];
        addedCount.kept++;
      }
    }

    fs.writeFileSync(localeFile, JSON.stringify(newLocale, null, 2) + '\n', 'utf8');

    const parts = [];
    if (addedCount.ai > 0) parts.push(`${addedCount.ai} con IA`);
    if (addedCount.pending > 0) parts.push(`${addedCount.pending} [PENDING]`);
    console.log(`   ✅ ${locale}.json → ${parts.join(', ')}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔨 Compilando traducciones...\n');

  if (USE_AI) {
    console.log('🌐 MyMemory: activado (sin key, sin registro)\n');
  }

  const langFiles = findLangFiles(SRC_DIR);

  if (langFiles.length === 0) {
    console.error('❌ No se encontraron archivos .lang.ts en src/');
    process.exit(1);
  }

  console.log(`✅ ${langFiles.length} archivo(s) .lang.ts:`);
  langFiles.forEach((f) => console.log(`   - ${path.relative(SRC_DIR, f)}`));

  // Agrupar por directorio (los JSONs se generan junto al .lang.ts)
  const dirs = new Map();
  for (const file of langFiles) {
    const dir = path.dirname(file);
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir).push(file);
  }

  for (const [dir, files] of dirs) {
    await compileDirectory(files, dir);
  }

  console.log('\n✅ Compilación completada!\n');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
