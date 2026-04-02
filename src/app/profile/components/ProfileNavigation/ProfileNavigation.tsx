'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Box, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

const MotionBox = motion(Box);

interface NavigationItem {
  id: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  badge?: number;
}

interface ProfileNavigationProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  booksCount?: number;
  hallOfFameCount?: number;
  children?: React.ReactNode;
  basePath?: string;
}

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeTab,
  onTabChange,
  booksCount = 0,
  hallOfFameCount = 0,
  children,
  basePath = '/profile',
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleTabClick = (tabId: number) => {
    if (tabId === 0) {
      // Remove query param for Library tab
      router.push(basePath);
    } else {
      router.push(`${basePath}?tab=${tabId}`);
    }
    onTabChange(tabId);
  };

  const navigationItems: NavigationItem[] = [
    {
      id: 0,
      label: t('profile.nav.library'),
      icon: <AutoStoriesIcon sx={{ fontSize: 20 }} />,
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
      badge: booksCount,
    },
    {
      id: 1,
      label: t('profile.nav.hallOfFame'),
      icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: hallOfFameCount,
    },
    {
      id: 2,
      label: t('profile.nav.stats'),
      icon: <BarChartIcon sx={{ fontSize: 20 }} />,
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      id: 3,
      label: t('profile.nav.activity'),
      icon: <TimelineIcon sx={{ fontSize: 20 }} />,
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        mt: 2,
      }}
    >
      {/* Fila principal: navegación + filtros */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        {/* Navegación horizontal compacta */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 1.5,
            overflowX: 'auto',
            overflowY: 'visible',
            flex: { xs: '1 1 100%', md: '0 1 auto' },
            px: { xs: 1, sm: 0 },
            py: 1,
            // Ocultar scrollbar pero mantener funcionalidad
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE y Edge
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Opera
            },
          }}
        >
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <MotionBox
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                whileTap={{ scale: 0.98 }}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive
                    ? item.gradient
                    : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(12px)',
                  border: isActive
                    ? `1px solid transparent`
                    : `1px solid ${item.color}25`,
                  boxShadow: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  '&:hover': !isActive
                    ? {
                        background: `${item.color}0f`,
                        borderColor: `${item.color}55`,
                        boxShadow: `0 2px 8px ${item.color}20`,
                      }
                    : {},
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isActive ? '70%' : 0,
                    height: 3,
                    background: item.gradient,
                    borderRadius: '2px 2px 0 0',
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                {/* Icono */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#fff' : item.color,
                    opacity: isActive ? 1 : 0.8,
                    '& svg': {
                      filter: isActive
                        ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))'
                        : 'none',
                    },
                  }}
                >
                  {item.icon}
                </Box>

                {/* Label */}
                <Typography
                  sx={{
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.3px',
                  }}
                >
                  {item.label}
                </Typography>

                {/* Badge inline */}
                {item.badge !== undefined && item.badge > 0 && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 28,
                      fontSize: 11,
                      fontWeight: 'bold',
                      fontFamily: lora.style.fontFamily,
                      background: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : `${item.color}30`,
                      color: isActive ? '#fff' : item.color,
                      border: isActive
                        ? '1px solid rgba(255, 255, 255, 0.3)'
                        : `1px solid ${item.color}50`,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                )}
              </MotionBox>
            );
          })}
        </Box>

        {/* Filtros compactos a la derecha */}
        {children && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flex: { xs: '1 1 100%', md: '1 1 auto' },
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              px: { xs: 1, sm: 0 },
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};
