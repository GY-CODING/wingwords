import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function FriendCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '18px',
        padding: '0.9rem 1rem',
        width: '100%',
      }}
    >
      <Skeleton
        variant="circular"
        width={48}
        height={48}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)', flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="55%"
          height={24}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
      </Box>
      {/* Hueco del chevron (22px) y círculo del botón de quitar amigo,
          con las medidas de FriendCard */}
      <Box sx={{ width: 22, flexShrink: 0 }} />
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.04)',
          flexShrink: 0,
        }}
      />
    </Box>
  );
}
