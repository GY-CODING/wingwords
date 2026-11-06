'use client';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';

const MotionBox = motion(Box);

import { ViewType } from '../../utils/profileTypes';
export type { ViewType } from '../../utils/profileTypes';

interface BooksViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  isOwnProfile?: boolean;
}

export const BooksViewToggle: React.FC<BooksViewToggleProps> = ({
  view,
  onViewChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleViewChange = (newView: ViewType) => {
    router.push(`${pathname}?view=${newView}`);
    onViewChange(newView);
  };

  const allViews: {
    type: ViewType;
    icon: React.ReactElement;
    label: string;
    short: string;
  }[] = [
    {
      type: 'grid',
      icon: <GridViewIcon />,
      label: t('profile.view.grid'),
      short: t('profile.view.short.grid'),
    },
    {
      type: 'list',
      icon: <ViewListIcon />,
      label: t('profile.view.list'),
      short: t('profile.view.short.list'),
    },
    {
      type: 'timeline',
      icon: <TimelineIcon />,
      label: t('profile.view.timeline'),
      short: t('profile.view.short.timeline'),
    },
    {
      type: 'calendar',
      icon: <CalendarMonthIcon />,
      label: t('profile.view.calendar'),
      short: t('profile.view.short.calendar'),
    },
  ];

  // Como en la app: la vista activa es una píldora morada con icono + nombre;
  // el resto, solo el icono. La píldora se desliza y crece hasta su sitio.
  return (
    <Box
      role="radiogroup"
      aria-label={t('profile.view.label')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {allViews.map((viewOption) => {
        const isActive = view === viewOption.type;
        return (
          <Tooltip
            key={viewOption.type}
            title={isActive ? '' : viewOption.label}
            arrow
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              style={{ display: 'inline-flex' }}
            >
              <Box
                component="button"
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={viewOption.label}
                onClick={() => handleViewChange(viewOption.type)}
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  height: 38,
                  px: isActive ? 1.5 : 1,
                  border: 0,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.55)',
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                  outline: 'none',
                  '&:hover': { color: '#fff' },
                  '&:focus-visible': {
                    boxShadow: '0 0 0 2px rgba(192,132,252,0.6)',
                  },
                  '& svg': { fontSize: '1.3rem', position: 'relative' },
                }}
              >
                {isActive && (
                  <MotionBox
                    layoutId="activeViewBackground"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background:
                        'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                      boxShadow: '0 6px 18px -8px rgba(147, 51, 234, 0.8)',
                    }}
                  />
                )}
                {viewOption.icon}
                {isActive && (
                  <Box component="span" sx={{ position: 'relative' }}>
                    {viewOption.short}
                  </Box>
                )}
              </Box>
            </motion.div>
          </Tooltip>
        );
      })}
    </Box>
  );
};
