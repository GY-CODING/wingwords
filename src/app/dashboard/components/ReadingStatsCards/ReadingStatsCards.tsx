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
import { CountUp } from '../../motion/CountUp';
import { DURATION } from '../../motion/tokens';

interface ReadingStatsCardsProps {
  totalBooks: number;
  booksRead: number;
  booksReadThisYear: number;
  displayYear?: number;
  isLoading: boolean;
}

// Skeleton individual para cada card de stats
const StatCardSkeleton: React.FC = () => (
  <Paper
    sx={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: 2,
      border: '1px solid rgba(255, 255, 255, 0.06)',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Skeleton
          variant="text"
          width={60}
          height={48}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={24}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', mt: 0.5 }}
        />
      </Box>
      <Skeleton
        variant="rounded"
        width={40}
        height={40}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
        }}
      />
    </Box>
  </Paper>
);

/**
 * Cards de estadísticas de lectura.
 * Memoizado para evitar re-renders cuando cambian actividades u otros datos.
 */
export const ReadingStatsCards = React.memo<ReadingStatsCardsProps>(
  ({ totalBooks, booksRead, booksReadThisYear, displayYear, isLoading }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const currentYear = new Date().getFullYear();
    const yearToDisplay = displayYear || currentYear;

    const cards = useMemo(
      () => [
        {
          title: t('dashboard.stats.totalBooks'),
          value: totalBooks,
          icon: MenuBookIcon,
          color: '#818cf8',
          onClick: () => router.push('/profile'),
        },
        {
          title: t('dashboard.stats.booksRead'),
          value: booksRead,
          icon: CheckCircleIcon,
          color: '#6ee7b7',
          onClick: () => router.push('/profile?status=read'),
        },
        {
          title: `${t('dashboard.stats.readIn')} ${yearToDisplay}`,
          value: booksReadThisYear,
          icon: TrendingUpIcon,
          color: '#fbbf24',
          onClick: () => router.push(`/profile?year=${yearToDisplay}`),
        },
      ],
      [totalBooks, booksRead, booksReadThisYear, yearToDisplay, router, t]
    );

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 1,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('dashboard.stats.title')}
        </Typography>

        {isLoading
          ? cards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.base }}
              >
                <StatCardSkeleton />
              </motion.div>
            ))
          : cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={false}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Paper
                    role="link"
                    tabIndex={0}
                    onClick={card.onClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') card.onClick();
                    }}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: 1.5,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: `border-color ${DURATION.base}s, background-color ${DURATION.base}s`,
                      // Luz del color de la tarjeta desde la esquina del icono
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(120% 140% at 100% 50%, ${card.color}14 0%, transparent 55%)`,
                        opacity: 0,
                        transition: `opacity ${DURATION.slow}s`,
                        pointerEvents: 'none',
                      },
                      '&:hover, &:focus-visible': {
                        borderColor: `${card.color}40`,
                        background: 'rgba(255, 255, 255, 0.04)',
                      },
                      '&:hover::after, &:focus-visible::after': { opacity: 1 },
                      '&:hover .ww-stat-icon, &:focus-visible .ww-stat-icon': {
                        transform: 'scale(1.06) rotate(-4deg)',
                        background: `${card.color}2E`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 0.25,
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontFamily: lora.style.fontFamily,
                            lineHeight: 1.15,
                          }}
                        >
                          <CountUp value={card.value} />
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.55)',
                            fontSize: '0.8rem',
                            fontFamily: lora.style.fontFamily,
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>

                      <Box
                        className="ww-stat-icon"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: `${card.color}1F`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: `transform ${DURATION.slow}s cubic-bezier(0.16, 1, 0.3, 1), background-color ${DURATION.base}s`,
                        }}
                      >
                        <Icon sx={{ color: card.color, fontSize: 24 }} />
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              );
            })}
      </Box>
    );
  }
);

ReadingStatsCards.displayName = 'ReadingStatsCards';
