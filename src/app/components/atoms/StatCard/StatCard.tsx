'use client';

import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface StatCardProps {
  title: string;
  children: React.ReactNode;
}

const cardSx = {
  width: { xs: '100%', sm: '460px', md: '500px' },
  minHeight: '400px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '20px',
  display: 'flex',
  // Como en la app: el título arriba a la izquierda y el contenido debajo
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  padding: 3,
  flexDirection: 'column',
  gap: 2,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  transition: 'border-color 0.25s',
  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.1)' },
};

const contentSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
} as const;

// Visible desde el primer pintado: antes las nueve tarjetas entraban en
// cadena (0,1 s → 0,9 s) y la pestaña parecía tardar en cargar.
const StatCard: React.FC<StatCardProps> = ({ title, children }) => (
  <Box sx={cardSx}>
    <Typography
      component="h3"
      sx={{
        color: 'white',
        fontFamily: lora.style.fontFamily,
        fontSize: '1.35rem',
        fontWeight: 700,
        lineHeight: 1.2,
        textAlign: 'left',
      }}
    >
      {title}
    </Typography>
    <Box sx={contentSx}>{children}</Box>
  </Box>
);

export default StatCard;
