/**
 * Lenguaje de movimiento del dashboard.
 *
 * Una sola curva de salida (deceleración exponencial) para todo el panel,
 * duraciones cortas para el feedback y una entrada orquestada por columnas.
 * Con `prefers-reduced-motion` el `MotionConfig` de la página quita los
 * desplazamientos y deja solo los fundidos.
 */

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  /** Feedback inmediato (hover, tap). */
  fast: 0.15,
  /** Cambio de estado rutinario. */
  base: 0.25,
  /** Cambios de vista (carrusel, píldoras). */
  slow: 0.35,
  /** Llenado de la barra de progreso. */
  focal: 0.6,
} as const;

/**
 * Regla de carga: el contenido se ve desde el primer pintado. Nada entra
 * desde opacidad 0 ni en cadena al cargar la página (hacía que el dashboard
 * pareciera tardar en cargar). El movimiento queda para el feedback (hover,
 * "me gusta") y los cambios de estado (carrusel, datos nuevos).
 */
/** Elementos que llegan después (página siguiente del feed): fundido breve. */
export const lateFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DURATION.base, ease: EASE_OUT },
};
