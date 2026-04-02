#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script para verificar consistencia entre archivos de traducción
 *
 * Uso:
 *   node scripts/check-translations.cjs
 *
 * Qué hace:
 * 1. Busca todos los archivos .lang.ts y sus directorios
 * 2. Lee los archivos .lang.ts (fuente de verdad) y verifica los .json generados
 * 3. Compara las claves entre todos los locales
 * 4. Reporta claves faltantes, extras y traducciones pendientes [PENDING]
 * 5. Sale con código 1 si hay errores (útil en lint-staged / CI)
 */

const fs = require('fs');
const path = require('path');
const localesConfig = require('./locales.config.cjs');

const SRC_DIR = path.join(__dirname, '../src');
const SOURCE_LOCALE = localesConfig.defaultLocale;
const SUPPORTED_LOCALES = localesConfig.supportedLocales;
const TRANSLATION_LOCALES = localesConfig.translationLocales;

function findLangFiles(dir) {
  const langFiles = [];

  function searchDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) searchDir(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.lang.ts'))
        langFiles.push(fullPath);
    }
  }

  searchDir(dir);
  return langFiles;
}

function extractMessagesFromLangFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const messages = {};
  const messageRegex =
    /(\w+):\s*\{\s*id:\s*["']([^"']+)["'],\s*defaultMessage:\s*["']([^"']+)["']/g;

  let match;
  while ((match = messageRegex.exec(content)) !== null) {
    messages[match[2]] = match[3];
  }
  return messages;
}

function checkDirectoryTranslations(langFiles, localesDir) {
  const relDir = path.relative(SRC_DIR, localesDir);
  console.log(`\n📁 ${relDir}`);

  const sourceMessages = {};
  langFiles.forEach((file) => {
    Object.assign(sourceMessages, extractMessagesFromLangFile(file));
  });
  const sourceKeys = Object.keys(sourceMessages);
  console.log(`   🔑 Fuente (${SOURCE_LOCALE}): ${sourceKeys.length} claves`);

  let dirHasErrors = false;
  let dirHasPending = false;

  SUPPORTED_LOCALES.forEach((locale) => {
    const localeFile = path.join(localesDir, `${locale}.json`);

    if (!fs.existsSync(localeFile)) {
      console.log(`   ❌ ${locale}.json: NO EXISTE — ejecuta npm run i18n:compile`);
      dirHasErrors = true;
      return;
    }

    const messages = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    const localeKeys = Object.keys(messages);

    const missing = sourceKeys.filter((k) => !messages[k]);
    const extra = localeKeys.filter((k) => !sourceMessages[k]);
    const pending = localeKeys.filter(
      (k) => typeof messages[k] === 'string' && messages[k].startsWith('[PENDING]'),
    );

    const hasIssues = missing.length > 0 || extra.length > 0;
    const icon = hasIssues ? '❌' : pending.length > 0 ? '⚠️ ' : '✅';
    console.log(
      `   ${icon} ${locale}.json: ${localeKeys.length} claves${pending.length > 0 ? ` (${pending.length} pendientes)` : ''}`,
    );

    if (missing.length > 0) {
      console.log(`      Faltan (${missing.length}):`);
      missing.forEach((k) => console.log(`        - ${k}`));
      dirHasErrors = true;
    }
    if (extra.length > 0) {
      console.log(`      Extras/obsoletas (${extra.length}):`);
      extra.forEach((k) => console.log(`        - ${k}`));
      dirHasErrors = true;
    }
    if (pending.length > 0) {
      dirHasPending = true;
    }
  });

  return { hasErrors: dirHasErrors, hasPending: dirHasPending };
}

function main() {
  console.log('🔍 Verificando archivos de traducción...');

  const langFiles = findLangFiles(SRC_DIR);

  if (langFiles.length === 0) {
    console.log('\n⚠️  No se encontraron archivos .lang.ts en src/');
    process.exit(0);
  }

  const directoriesMap = new Map();
  langFiles.forEach((file) => {
    const dir = path.dirname(file);
    if (!directoriesMap.has(dir)) directoriesMap.set(dir, []);
    directoriesMap.get(dir).push(file);
  });

  let globalErrors = false;
  let globalPending = false;

  directoriesMap.forEach((files, dir) => {
    const { hasErrors, hasPending } = checkDirectoryTranslations(files, dir);
    if (hasErrors) globalErrors = true;
    if (hasPending) globalPending = true;
  });

  console.log('');

  if (globalErrors) {
    console.log('❌ Se encontraron errores en las traducciones.');
    console.log('   Ejecuta: npm run i18n:compile\n');
    process.exit(1);
  }

  if (globalPending) {
    console.log('⚠️  Hay traducciones pendientes (marcadas con [PENDING]).');
    console.log('   Edita los .json y reemplaza [PENDING] con la traducción correcta.\n');
    // No falla el proceso para no bloquear flujo de trabajo
    process.exit(0);
  }

  console.log('✅ Todas las traducciones están sincronizadas y completas.\n');
}

main();
