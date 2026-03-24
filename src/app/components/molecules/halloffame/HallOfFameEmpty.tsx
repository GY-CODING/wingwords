'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { lora } from '@/utils/fonts/fonts';

interface HallOfFameEmptyProps {
  isOwnProfile?: boolean;
}

export const HallOfFameEmpty: React.FC<HallOfFameEmptyProps> = ({
  isOwnProfile = true,
}) => (
  <Box
    sx={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(245,158,11,0.1)',
      borderRadius: '20px',
      padding: '3rem 2rem',
      width: '100%',
      maxWidth: '900px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      userSelect: 'none',
    }}
  >
    <WorkspacePremiumIcon
      sx={{ fontSize: 54, color: 'rgba(245,158,11,0.25)' }}
    />
    <Typography
      sx={{
        fontFamily: lora.style.fontFamily,
        fontStyle: 'italic',
        fontSize: { xs: '1.1rem', md: '1.25rem' },
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
      }}
    >
      {isOwnProfile
        ? 'Your Hall of Fame is empty.'
        : 'This user has no books in their Hall of Fame yet.'}
    </Typography>
    {isOwnProfile && (
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
        }}
      >
        Add your favourite books to build your personal showcase.
      </Typography>
    )}
  </Box>
);
