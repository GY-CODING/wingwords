import { Box, Skeleton } from '@mui/material';
import React from 'react';

// Colors match ProfileNavigation tab colors
const TAB_CONFIGS = [
  { width: 100, color: 'rgba(168, 85, 247, 0.15)' }, // Library – purple
  { width: 80, color: 'rgba(232, 121, 249, 0.12)' }, // Lists – fuchsia
  { width: 130, color: 'rgba(245, 158, 11, 0.12)' }, // Hall of Fame – amber
  { width: 80, color: 'rgba(96, 165, 250, 0.12)' }, // Stats – blue
  { width: 95, color: 'rgba(52, 211, 153, 0.12)' }, // Activity – green
];

export const TabsSkeleton: React.FC = () => (
  <Box
    sx={{
      width: '100%',
      mb: 2,
      mt: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      overflowX: 'auto',
      px: { xs: 1, sm: 0 },
      py: 1,
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    {TAB_CONFIGS.map(({ width, color }, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        width={width}
        height={42}
        animation="wave"
        sx={{
          borderRadius: '12px',
          bgcolor: color,
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    ))}
  </Box>
);

export default TabsSkeleton;
