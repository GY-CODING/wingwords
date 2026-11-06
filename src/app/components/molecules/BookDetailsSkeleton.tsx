import { Box, Skeleton } from '@mui/material';
import React from 'react';

const SKEL = { bgcolor: 'rgba(255,255,255,0.05)' } as const;
const SKEL_DIM = { bgcolor: 'rgba(255,255,255,0.03)' } as const;
const SKEL_PURPLE = { bgcolor: 'rgba(147,51,234,0.1)' } as const;

const BookDetailsSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'transparent',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          pt: { xs: 5, md: 9 },
        }}
      >
        {/* Hero row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 7 },
            alignItems: 'flex-start',
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Cover wrapper — centers cover+actions on mobile */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'contents' },
              justifyContent: { xs: 'center', md: 'unset' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Cover */}
              <Skeleton
                variant="rectangular"
                sx={{
                  width: { xs: 200, sm: 230, md: 260 },
                  height: { xs: 290, sm: 336, md: 380 },
                  borderRadius: '18px',
                  ...SKEL,
                }}
              />

              {/* Rating stars */}
              <Skeleton
                variant="rectangular"
                width={160}
                height={36}
                sx={{ borderRadius: '8px', mt: 2.5, ...SKEL_DIM }}
              />

              {/* Hall of Fame button */}
              <Skeleton
                variant="rectangular"
                width={180}
                height={38}
                sx={{ borderRadius: '10px', mt: 1.5, ...SKEL_DIM }}
              />
            </Box>
          </Box>

          {/* Right: info */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
            {/* Series badge */}
            <Skeleton
              variant="rectangular"
              width={90}
              height={22}
              sx={{ borderRadius: '100px', mb: 2, ...SKEL_PURPLE }}
            />

            {/* Title */}
            <Skeleton
              variant="text"
              width="80%"
              height={58}
              sx={{ mb: 0.5, ...SKEL }}
            />
            <Skeleton
              variant="text"
              width="55%"
              height={52}
              sx={{ mb: 1.5, ...SKEL }}
            />

            {/* Author */}
            <Skeleton
              variant="text"
              width={180}
              height={28}
              sx={{ mb: 3, ...SKEL_DIM }}
            />

            {/* Meta row: rating + pages + editions */}
            <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
              <Skeleton
                variant="rectangular"
                width={60}
                height={22}
                sx={{ borderRadius: '6px', bgcolor: 'rgba(251,191,36,0.1)' }}
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={22}
                sx={{ borderRadius: '6px', ...SKEL_DIM }}
              />
              <Skeleton
                variant="rectangular"
                width={110}
                height={22}
                sx={{ borderRadius: '6px', ...SKEL_PURPLE }}
              />
            </Box>

            {/* Divider */}
            <Box
              sx={{
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
                mb: 3,
              }}
            />

            {/* Description lines */}
            {['100%', '97%', '100%', '93%', '99%', '88%'].map((w, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={w}
                height={24}
                sx={{ mb: 0.75, ...SKEL_DIM }}
              />
            ))}

            {/* Author card skeleton */}
            <Box sx={{ mt: 4 }}>
              <Skeleton
                variant="text"
                width={110}
                height={16}
                sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.02)' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    flexShrink: 0,
                    ...SKEL,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={22}
                    sx={{ mb: 1, ...SKEL }}
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={16}
                    sx={{ mb: 0.5, ...SKEL_DIM }}
                  />
                  <Skeleton
                    variant="text"
                    width="75%"
                    height={16}
                    sx={{ ...SKEL_DIM }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetailsSkeleton;
