'use client';

import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

/**
 * Acciones rápidas del dashboard.
 * Memoizado porque no depende de datos que cambien frecuentemente.
 */
export const QuickActions = React.memo(() => {
  const { t } = useTranslation();
  const router = useRouter();

  const actions = [
    {
      title: t('dashboard.quickActions.books'),
      icon: SearchIcon,
      onClick: () => router.push('/books'),
    },
    {
      title: t('dashboard.quickActions.myStats'),
      icon: BarChartIcon,
      onClick: () => router.push('/profile?tab=3'),
    },
    {
      title: t('dashboard.quickActions.calendar'),
      icon: CalendarMonthIcon,
      onClick: () => router.push('/profile?view=calendar'),
    },
    {
      title: t('dashboard.quickActions.hallOfFame'),
      icon: EmojiEventsIcon,
      onClick: () => router.push('/profile?tab=2'),
    },
    {
      title: t('dashboard.quickActions.community'),
      icon: PeopleIcon,
      onClick: () => router.push('/users/community'),
    },
    {
      title: t('dashboard.quickActions.timeline'),
      icon: TimelineIcon,
      onClick: () => router.push('/profile?view=timeline'),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 2,
          fontFamily: lora.style.fontFamily,
        }}
      >
        {t('dashboard.quickActions.title')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Paper
                onClick={action.onClick}
                sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  padding: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    background: 'rgba(147, 51, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Icon sx={{ color: '#a855f7', fontSize: 18 }} />
                </Box>
                <Tooltip title={action.title} placement="top" arrow>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {action.title.length > 11
                      ? `${action.title.slice(0, 10)}…`
                      : action.title}
                  </Typography>
                </Tooltip>
              </Paper>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
});

QuickActions.displayName = 'QuickActions';
