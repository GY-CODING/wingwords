'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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
  isOwnProfile?: boolean;
}

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeTab,
  onTabChange,
  booksCount = 0,
  hallOfFameCount = 0,
  children,
  basePath = '/profile',
  isOwnProfile = true,
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

  const allNavigationItems: NavigationItem[] = [
    {
      id: 0,
      label: t('profile.nav.library'),
      icon: <AutoStoriesIcon sx={{ fontSize: 20 }} />,
      color: '#c084fc',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      badge: booksCount,
    },
    {
      id: 1,
      label: t('profile.nav.lists'),
      icon: <FormatListBulletedIcon sx={{ fontSize: 20 }} />,
      color: '#c084fc',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    },
    {
      id: 2,
      label: t('profile.nav.hallOfFame'),
      icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: hallOfFameCount,
    },
    {
      id: 3,
      label: t('profile.nav.stats'),
      icon: <BarChartIcon sx={{ fontSize: 20 }} />,
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      id: 4,
      label: t('profile.nav.activity'),
      icon: <TimelineIcon sx={{ fontSize: 20 }} />,
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  const navigationItems = isOwnProfile
    ? allNavigationItems
    : allNavigationItems.filter((item) => item.id !== 1);

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
          role="tablist"
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
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                onClick={() => handleTabClick(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTabClick(item.id);
                  }
                }}
                whileTap={{ scale: 0.97 }}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  // Como en la app: la activa rellena con su color; el resto,
                  // cristal con borde y texto teñidos de su color.
                  background: isActive
                    ? item.gradient
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isActive
                    ? '1px solid transparent'
                    : `1px solid ${item.color}33`,
                  boxShadow: isActive
                    ? `0 8px 22px -10px ${item.color}aa, inset 0 1px 0 rgba(255,255,255,0.18)`
                    : 'none',
                  transition:
                    'background-color 0.25s, border-color 0.25s, box-shadow 0.25s',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                  '&:hover': !isActive
                    ? {
                        background: `${item.color}12`,
                        borderColor: `${item.color}66`,
                      }
                    : {},
                  '&:focus-visible': {
                    boxShadow: `0 0 0 2px ${item.color}99`,
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
                    color: isActive ? '#fff' : item.color,
                    fontFamily: lora.style.fontFamily,
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 400,
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
                        ? 'rgba(255, 255, 255, 0.22)'
                        : `${item.color}22`,
                      color: isActive ? '#fff' : item.color,
                      border: 'none',
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
