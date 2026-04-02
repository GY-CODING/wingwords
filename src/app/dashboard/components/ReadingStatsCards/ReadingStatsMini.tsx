'use client';

import { lora } from '@/utils/fonts/fonts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

const MotionBox = motion(Box);

interface ReadingStatsMiniProps {
  totalBooks: number;
  booksRead: number;
  booksReadThisYear: number;
  displayYear?: number;
  isLoading: boolean;
}

/**
 * Skeleton para las mini stats cards.
 */
const StatMiniSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
    }}
  >
    {[1, 2, 3].map((i) => (
      <Paper
        key={i}
        sx={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 2.5,
          p: 1.5,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center',
        }}
      >
        <Skeleton
          variant="circular"
          width={28}
          height={28}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            margin: '0 auto',
            mb: 0.5,
          }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={22}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', margin: '0 auto' }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={12}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', margin: '0 auto' }}
        />
      </Paper>
    ))}
  </Box>
);

/**
 * Mini cards de estadísticas de lectura para mobile.
 * 3 cards en una fila horizontal, diseño compacto y limpio.
 */
export const ReadingStatsMini = React.memo<ReadingStatsMiniProps>(
  ({ totalBooks, booksRead, booksReadThisYear, displayYear, isLoading }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const currentYear = new Date().getFullYear();
    const yearToDisplay = displayYear || currentYear;

    const cards = useMemo(
      () => [
        {
          label: t('dashboard.stats.library'),
          value: totalBooks,
          icon: MenuBookIcon,
          color: '#818cf8',
          onClick: () => router.push('/profile'),
        },
        {
          label: t('dashboard.stats.read'),
          value: booksRead,
          icon: CheckCircleIcon,
          color: '#6ee7b7',
          onClick: () => router.push('/profile?status=read'),
        },
        {
          label: `${yearToDisplay}`,
          value: booksReadThisYear,
          icon: TrendingUpIcon,
          color: '#fbbf24',
          onClick: () => router.push(`/profile?year=${yearToDisplay}`),
        },
      ],
      [totalBooks, booksRead, booksReadThisYear, yearToDisplay, router, t]
    );

    if (isLoading) {
      return <StatMiniSkeleton />;
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <MotionBox
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Paper
                onClick={card.onClick}
                sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 2.5,
                  p: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  WebkitTapHighlightColor: 'transparent',
                  '&:active': {
                    transform: 'scale(0.96)',
                    background: `${card.color}08`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 0.5,
                  }}
                >
                  <Icon sx={{ color: card.color, fontSize: 16 }} />
                </Box>

                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.92)',
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '0.6rem',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    mt: 0.15,
                  }}
                >
                  {card.label}
                </Typography>
              </Paper>
            </MotionBox>
          );
        })}
      </Box>
    );
  }
);

ReadingStatsMini.displayName = 'ReadingStatsMini';
