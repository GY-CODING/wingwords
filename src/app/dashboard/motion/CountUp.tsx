'use client';

import { animate, useReducedMotion } from 'framer-motion';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { DURATION, EASE_OUT } from './tokens';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface CountUpProps {
  value: number;
  /** Retardo antes de empezar a contar (s). */
  delay?: number;
  duration?: number;
  /** Texto detrás del número (p. ej. "%"). */
  suffix?: string;
  /**
   * Contar también al montarse (desde 0). Por defecto no: al cargar la página
   * el número sale ya en su valor y solo se anima cuando cambia después.
   */
  animateOnMount?: boolean;
}

/**
 * Número que cuenta desde su valor anterior (0 la primera vez) hasta `value`.
 * Escribe directamente en el DOM para no re-renderizar en cada fotograma.
 * Con movimiento reducido pinta el valor final sin animar.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  delay = 0,
  duration = DURATION.focal,
  suffix = '',
  animateOnMount = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(animateOnMount ? 0 : value);
  const reduceMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Se cambia el valor del nodo de texto que ya creó React (no se reemplaza),
    // así React lo sigue reconociendo en el siguiente render.
    const write = (n: number) => {
      // Se guarda lo que de verdad se ha pintado: si el efecto se cancela a
      // medias (cambio de valor, doble montaje en StrictMode) se sigue desde ahí.
      previous.current = n;
      const text = `${Math.round(n)}${suffix}`;
      if (node.firstChild) node.firstChild.nodeValue = text;
      else node.textContent = text;
    };

    const from = previous.current;

    if (reduceMotion || from === value) {
      write(value);
      return;
    }

    // Antes del primer pintado, para que no asome el valor final.
    write(from);
    const controls = animate(from, value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: write,
    });
    return () => controls.stop();
  }, [value, delay, duration, suffix, reduceMotion]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {/* Valor final en el HTML: el lector de pantalla y el primer pintado no ven el 0 */}
      {`${Math.round(value)}${suffix}`}
    </span>
  );
};
