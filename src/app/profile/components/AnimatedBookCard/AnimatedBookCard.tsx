'use client';
import React from 'react';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact/BookCardCompact';
import HardcoverBook from '@/domain/HardcoverBook';

interface AnimatedBookCardProps {
  book: HardcoverBook;
  /** Ya no se usa (antes escalonaba la entrada); se mantiene por compatibilidad. */
  index?: number;
}

export const AnimatedBookCard: React.FC<AnimatedBookCardProps> = ({ book }) => {
  // Sin entrada desde opacidad 0: las portadas salen visibles en el primer
  // pintado (son las candidatas a LCP) y al hacer scroll no hay que esperar a
  // que aparezcan. El movimiento de la tarjeta queda para el hover.
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BookCardCompact book={book} />
    </div>
  );
};
