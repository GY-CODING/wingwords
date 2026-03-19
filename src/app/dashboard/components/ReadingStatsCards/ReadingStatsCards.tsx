'use client';

import { lora } from '@/utils/fonts/fonts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

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
    const router = useRouter();
    const currentYear = new Date().getFullYear();
    const yearToDisplay = displayYear || currentYear;

    const cards = useMemo(
      () => [
        {
          title: 'Total Books',
          value: totalBooks,
          icon: MenuBookIcon,
          color: '#818cf8',
          onClick: () => router.push('/profile'),
        },
        {
          title: 'Books Read',
          value: booksRead,
          icon: CheckCircleIcon,
          color: '#6ee7b7',
          onClick: () => router.push('/profile?status=read'),
        },
        {
          title: `Read in ${yearToDisplay}`,
          value: booksReadThisYear,
          icon: TrendingUpIcon,
          color: '#fbbf24',
          onClick: () => router.push(`/profile?year=${yearToDisplay}`),
        },
      ],
      [totalBooks, booksRead, booksReadThisYear, yearToDisplay, router]
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
          Reading Stats
        </Typography>

        {isLoading
          ? cards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatCardSkeleton />
              </motion.div>
            ))
          : cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <Paper
                    onClick={card.onClick}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: 1.5,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      '&:hover': {
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.04)',
                      },
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
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 0.25,
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontFamily: lora.style.fontFamily,
                          }}
                        >
                          {card.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            fontFamily: lora.style.fontFamily,
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: `${card.color}1F`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          sx={{
                            color: card.color,
                            fontSize: 24,
                          }}
                        />
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
