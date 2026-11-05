'use client';
import { BookCardList } from '@/app/components/atoms/BookCardList/BookCardList';
import HardcoverBook from '@/domain/HardcoverBook';
import type { UserProfileBook } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { AnimatedBookCard } from '../AnimatedBookCard/AnimatedBookCard';
import { ReadingCalendar } from '../ReadingCalendar/ReadingCalendar';
import { ReadingTimeline } from '../ReadingTimeline/ReadingTimeline';

import { ViewType } from '../../utils/profileTypes';
export type { ViewType } from '../../utils/profileTypes';

interface BooksListProps {
  books: HardcoverBook[];
  hasMore: boolean;
  view?: ViewType;
}

export const BooksList: React.FC<BooksListProps> = ({
  books,
  hasMore,
  view = 'grid',
}) => {
  // Timeline view
  if (view === 'timeline') {
    return <ReadingTimeline books={books as UserProfileBook[]} />;
  }

  // Calendar view
  if (view === 'calendar') {
    return <ReadingCalendar books={books as UserProfileBook[]} />;
  }
  // Grid configuration based on view type
  const gridConfig = {
    grid: {
      xs: 'repeat(auto-fill, minmax(160px, 1fr))',
      sm: 'repeat(auto-fill, minmax(180px, 1fr))',
      md: 'repeat(auto-fill, minmax(200px, 1fr))',
    },
    // minmax(0, 1fr): sin esto la columna no encoge por debajo del título
    // (que va en una línea con "…") y la tercera se salía del contenedor.
    list: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
  };

  // Vista list usa BookCardList en grid
  if (view === 'list') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: gridConfig.list.xs,
            sm: gridConfig.list.sm,
            md: gridConfig.list.md,
          },
          gap: { xs: 1.5, sm: 2 },
          width: '100%',
          py: { xs: 1, md: 2 },
          px: { xs: 0.5, md: 1 },
        }}
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            // Visible desde el principio (antes, 34 libros = 0,7 s de cascada)
            initial={false}
            style={{ minWidth: 0 }}
          >
            <BookCardList book={book} />
          </motion.div>
        ))}
        {hasMore && books.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(168, 85, 247, 0.6)',
                fontFamily: lora.style.fontFamily,
                fontStyle: 'italic',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textShadow: 'none',
              }}
            >
              Scroll for more books...
            </Typography>
          </Box>
        )}
        {!hasMore && books.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontFamily: lora.style.fontFamily,
                fontSize: '0.85rem',
              }}
            >
              All books loaded
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Grid layout para compact y grid
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: gridConfig[view].xs,
          sm: gridConfig[view].sm,
          md: gridConfig[view].md,
        },
        gap: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        py: { xs: 1, md: 2 },
        px: { xs: 0.5, md: 1 },
      }}
    >
      {books.map((book, index) => (
        <AnimatedBookCard key={book.id} book={book} index={index} />
      ))}
      {hasMore && books.length > 0 && (
        <Box
          sx={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(168, 85, 247, 0.6)',
              fontFamily: lora.style.fontFamily,
              fontStyle: 'italic',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textShadow: 'none',
            }}
          >
            Scroll for more books...
          </Typography>
        </Box>
      )}
      {!hasMore && books.length > 0 && (
        <Box
          sx={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontSize: '0.85rem',
            }}
          >
            All books loaded
          </Typography>
        </Box>
      )}
    </Box>
  );
};
