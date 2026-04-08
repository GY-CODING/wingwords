#!/usr/bin/env node

import { spawn } from 'child_process';
import { printBanner } from './banner.js';

// Variables para controlar el banner
let bannerShown = false;

function startNextDev() {
  // Usa dotenv para cargar variables y permite puerto dinámico
  const port = process.env.PORT || '3001';
  // Comando completo como string para evitar el warning de DeprecationWarning
  const command = `dotenv -e .env -- sh -c 'npx next dev --turbo -p $PORT'`;
  const nextProcess = spawn(command, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, PORT: port },
  });

  // Manejar stdout (salida normal)
  nextProcess.stdout.on('data', (data) => {
    const output = data.toString();

    // Mostrar la salida normal de Next.js
    process.stdout.write(output);

    // Detectar cuando Next.js está listo y mostrar el banner
    if (output.includes('✓ Ready in') && !bannerShown) {
      // Esperar un poco para que termine de mostrar el mensaje de Next.js
      setTimeout(() => {
        printBanner();
        bannerShown = true;
      }, 100);
    }
  });

  // Manejar stderr (errores)
  nextProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  // Manejar cierre del proceso
  nextProcess.on('close', (code) => {
    process.exit(code);
  });

  // Manejar señales de interrupción
  process.on('SIGINT', () => {
    nextProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    nextProcess.kill('SIGTERM');
  });
}

startNextDev();
