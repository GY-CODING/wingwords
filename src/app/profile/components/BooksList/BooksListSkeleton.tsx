import React from 'react';
import { Box, Skeleton } from '@mui/material';
import type { ViewType } from '../../utils/profileTypes';

const BG = { bgcolor: 'rgba(255, 255, 255, 0.06)' };

/**
 * Esqueleto de la biblioteca del perfil. Copia las medidas de lo que se pinta
 * después para que no salte al cargar:
 * - grid: mismas columnas que `BooksList` y la tarjeta de `BookCardCompact`
 *   (portada 2:3 redondeada, título, autor, estrellas, línea extra y saga);
 * - list: la fila de `BookCardList` en 1/2/3 columnas.
 */
export const BooksListSkeleton: React.FC<{ view?: ViewType }> = ({
  view = 'grid',
}) => {
  if (view === 'list') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: { xs: 1.5, sm: 2 },
          width: '100%',
          py: { xs: 1, md: 2 },
          px: { xs: 0.5, md: 1 },
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.75,
              minWidth: 0,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '18px',
            }}
          >
            <Skeleton
              variant="rectangular"
              width={64}
              height={96}
              sx={{ ...BG, borderRadius: '10px', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="80%" height={24} sx={BG} />
              <Skeleton variant="text" width="50%" height={20} sx={BG} />
              <Skeleton variant="text" width="65%" height={20} sx={BG} />
              <Skeleton
                variant="rounded"
                width="45%"
                height={22}
                sx={{ ...BG, borderRadius: '8px', mt: 0.5 }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(160px, 1fr))',
          sm: 'repeat(auto-fill, minmax(180px, 1fr))',
          md: 'repeat(auto-fill, minmax(200px, 1fr))',
        },
        gap: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        py: { xs: 1, md: 2 },
        px: { xs: 0.5, md: 1 },
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Skeleton
            variant="rectangular"
            sx={{
              ...BG,
              width: '100%',
              height: 'auto',
              aspectRatio: '2 / 3',
              borderRadius: '14px',
            }}
          />
          <Box
            sx={{
              pt: { xs: '10px', sm: '12px' },
              px: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '4px', sm: '6px' },
            }}
          >
            <Skeleton variant="text" width="85%" height={22} sx={BG} />
            <Skeleton variant="text" width="55%" height={18} sx={BG} />
            <Skeleton variant="text" width="45%" height={25} sx={BG} />
            <Skeleton variant="text" width="70%" height={22} sx={BG} />
            {/* La tarjeta reserva 32px para el chip de saga */}
            <Box sx={{ minHeight: { xs: 30, sm: 32 }, mt: 0.5 }}>
              <Skeleton
                variant="rounded"
                width="60%"
                height={24}
                sx={{ ...BG, borderRadius: '8px' }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BooksListSkeleton;
