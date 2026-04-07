#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer la versión del package.json
function getProjectVersion() {
  try {
    const packagePath = join(__dirname, '..', 'package.json');
    const packageContent = readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

const colors = {
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
};

function printBanner() {
  const version = getProjectVersion();
  console.log('');
  console.log(
    colors.blue +
      colors.bright +
      '   __    __ _             __    __              _       ' +
      colors.reset
  );
  console.log(
    colors.blue +
      colors.bright +
      '  / / /\\ \\ (_)_ __   __ _/ / /\\ \\ \\___  _ __ __| |___   ' +
      colors.reset
  );
  console.log(
    colors.blue +
      colors.bright +
      "  \\ \\/  \\/ / | '_ \\ / _` \\ \\/  \\/ / _ \\| '__/ _` / __|  " +
      colors.reset
  );
  console.log(
    colors.blue +
      colors.bright +
      '   \\  /\\  /| | | | | (_| |\\  /\\  / (_) | | | (_| \\__ \\  ' +
      colors.reset
  );
  console.log(
    colors.blue +
      colors.bright +
      '    \\/  \\/ |_|_| |_|\\__, | \\/  \\/ \\___/|_|  \\__,_|___/  ' +
      colors.reset
  );
  console.log(
    colors.blue +
      colors.bright +
      '                   |___/                               ' +
      colors.reset
  );
  console.log('');
  console.log(
    colors.green +
      colors.bright +
      '    📚 Your personal library is ready to soar' +
      colors.reset
  );
  console.log(
    colors.yellow + '    🚀 Powered by Next.js 15 + Turbopack' + colors.reset
  );
  console.log(
    colors.magenta +
      '    ✨ Discover, read and share your favorite books' +
      colors.reset
  );
  console.log(
    colors.cyan +
      '    📦 Version: ' +
      colors.white +
      colors.bright +
      'v' +
      version +
      colors.reset
  );
  console.log('');
  console.log(
    colors.dim +
      '    👉 Open your browser at: ' +
      colors.white +
      colors.bright +
      'http://localhost:3001' +
      colors.reset
  );
  console.log('');
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  printBanner();
}

export { printBanner };
