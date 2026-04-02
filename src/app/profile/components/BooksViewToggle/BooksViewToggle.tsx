'use client';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

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
  }[] = [
    { type: 'grid', icon: <GridViewIcon />, label: t('profile.view.grid') },
    { type: 'list', icon: <ViewListIcon />, label: t('profile.view.list') },
    {
      type: 'timeline',
      icon: <TimelineIcon />,
      label: t('profile.view.timeline'),
    },
    {
      type: 'calendar',
      icon: <CalendarMonthIcon />,
      label: t('profile.view.calendar'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '4px',
        boxShadow: 'none',
      }}
    >
      {allViews.map((viewOption) => {
        const isActive = view === viewOption.type;
        return (
          <Tooltip key={viewOption.type} title={viewOption.label} arrow>
            <Box sx={{ position: 'relative' }}>
              {isActive && (
                <MotionBox
                  layoutId="activeViewBackground"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    boxShadow: 'none',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={() => handleViewChange(viewOption.type)}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 36,
                  height: 36,
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: '#fff',
                    transform: isActive ? 'scale(1.05)' : 'scale(1.1)',
                  },
                  '& svg': {
                    fontSize: '1.25rem',
                    filter: isActive
                      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                      : 'none',
                  },
                }}
              >
                {viewOption.icon}
              </IconButton>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};
