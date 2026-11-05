'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { Box, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCard } from '@/app/components/atoms/BookCard/BookCard';

const MotionBox = motion(Box);

// Grid real: con flex-wrap y anchos calc(50% - 6px) el hueco de 14px hacía
// que entre 900 y 1200px solo cupiera una tarjeta por fila.
const GRID_SX = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
  gap: { xs: '8px', sm: '12px', md: '14px' },
  alignItems: 'stretch',
};

interface BooksGridProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

function BookCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '10px', md: '16px' },
        p: { xs: '10px', sm: '12px', md: '16px' },
        background: 'rgba(255,255,255,0.03)',
        borderRadius: { xs: '16px', md: '20px' },
        border: '1px solid rgba(255,255,255,0.06)',
        height: '100%',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: { xs: '64px', sm: '80px', md: '104px' },
          flexShrink: 0,
          // La portada real marca el alto de la tarjeta (proporción 2:3)
          height: 'auto',
          aspectRatio: '2 / 3',
          alignSelf: 'flex-start',
          borderRadius: { xs: '10px', md: '12px' },
          bgcolor: 'rgba(255,255,255,0.06)',
        }}
      />
      {/* Mismas filas que BookCard: título, autor, chip de saga y valoración */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: '5px', md: '7px' },
        }}
      >
        <Box>
          <Skeleton
            variant="text"
            width="70%"
            height={26}
            sx={{ bgcolor: 'rgba(255,255,255,0.07)' }}
          />
          <Skeleton
            variant="text"
            width="45%"
            height={22}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 0.5 }}
          />
          <Skeleton
            variant="rounded"
            width="50%"
            height={25}
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              mt: 0.75,
            }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={44}
          height={20}
          sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
        />
      </Box>
    </Box>
  );
}

export const BooksGrid: React.FC<BooksGridProps> = ({ books, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={GRID_SX}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{ minWidth: 0 }}>
            <BookCardSkeleton />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={GRID_SX}>
      <AnimatePresence mode="popLayout">
        {books.map((book, index) => (
          <MotionBox
            key={book.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.2,
              delay: Math.min(index * 0.02, 0.1),
            }}
            sx={{ minWidth: 0 }}
          >
            <BookCard book={book} />
          </MotionBox>
        ))}
      </AnimatePresence>
    </Box>
  );
};
