'use client';

import { Box } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { DURATION, EASE_OUT } from './tokens';

interface ProgressFillProps {
  /** 0..100 */
  value: number;
  height?: number;
  delay?: number;
  label?: string;
  trackColor?: string;
}

/**
 * Barra de progreso de lectura que se llena desde 0 y, al llegar, deja pasar
 * un brillo una sola vez. Solo anima `transform`: la barra completa se desplaza
 * dentro de la pista (como `LinearProgress`), así el brillo no se deforma.
 * Mismos colores que el `LinearProgress` que sustituye.
 */
export const ProgressFill: React.FC<ProgressFillProps> = ({
  value,
  height = 8,
  delay = 0,
  label,
  trackColor = 'rgba(147, 51, 234, 0.2)',
}) => {
  const reduceMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));

  return (
    <Box
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      sx={{
        position: 'relative',
        height,
        borderRadius: height / 2,
        overflow: 'hidden',
        backgroundColor: trackColor,
        // Evita la línea de 1px que asoma en algunos navegadores al recortar
        isolation: 'isolate',
      }}
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: `${pct - 100}%` }}
        transition={{ duration: DURATION.focal, ease: EASE_OUT, delay }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: height / 2,
          background: 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
          overflow: 'hidden',
        }}
      >
        {!reduceMotion && pct > 0 && (
          <motion.span
            aria-hidden
            initial={{ x: '-100%' }}
            animate={{ x: '340%' }}
            transition={{
              duration: 0.9,
              ease: [0.4, 0, 0.2, 1],
              delay: delay + DURATION.focal * 0.85,
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '30%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            }}
          />
        )}
      </motion.div>
    </Box>
  );
};
