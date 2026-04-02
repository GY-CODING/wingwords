'use client';

import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { User } from '@/domain/user.model';
import WavingHandIcon from '@mui/icons-material/WavingHand';

interface DashboardHeaderProps {
  user?: User;
  isLoading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState(t('dashboard.greeting.hello'));

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.greeting.morning'));
    else if (hour < 18) setGreeting(t('dashboard.greeting.afternoon'));
    else setGreeting(t('dashboard.greeting.evening'));
  }, [t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          border: '1px solid rgba(147, 51, 234, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at top right, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={{ xs: 60, sm: 70, md: 80 }}
            height={{ xs: 60, sm: 70, md: 80 }}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Avatar
              src={user?.picture}
              alt={user?.username}
              sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                border: '3px solid rgba(147, 51, 234, 0.5)',
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
              }}
            />
          </motion.div>
        )}

        <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: lora.style.fontFamily,
              }}
            >
              {greeting}
            </Typography>
            <motion.div
              animate={{
                rotate: [0, 14, -8, 14, -4, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <WavingHandIcon
                sx={{
                  color: '#fbbf24',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                }}
              />
            </motion.div>
          </Box>

          {isLoading ? (
            <Skeleton
              variant="text"
              width={{ xs: 150, sm: 200, md: 250 }}
              height={{ xs: 40, sm: 50, md: 60 }}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ffffff 0%, #9333ea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              {user?.username}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};
