import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ExploreIcon from '@mui/icons-material/Explore';
import React from 'react';

interface TabNavigationProps {
  tab: number;
  friendsCount?: number;
  onTabChange: (tab: number) => void;
}

const TABS = [
  {
    labelKey: 'community.tab.discover',
    icon: <ExploreIcon sx={{ fontSize: 18 }} />,
  },
  {
    labelKey: 'community.tab.friends',
    icon: <PeopleIcon sx={{ fontSize: 18 }} />,
  },
];

export function TabNavigation({
  tab,
  friendsCount,
  onTabChange,
}: TabNavigationProps) {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          p: '4px',
          gap: '4px',
        }}
      >
        {TABS.map(({ labelKey, icon }, index) => {
          const isActive = tab === index;
          const isFriendsTab = index === 1;
          return (
            <Box
              key={labelKey}
              onClick={() => onTabChange(index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(147,51,234,0.2)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(147,51,234,0.4)'
                  : '1px solid transparent',
                userSelect: 'none',
                '&:hover': !isActive
                  ? {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
                  : {},
              }}
            >
              <Box
                sx={{
                  color: isActive ? '#c084fc' : 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
              >
                {icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: '14px', sm: '15px' },
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                }}
              >
                {t(labelKey)}
              </Typography>
              {isFriendsTab &&
                friendsCount !== undefined &&
                friendsCount > 0 && (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: '10px',
                      background: isActive
                        ? 'rgba(147,51,234,0.6)'
                        : 'rgba(147,51,234,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 0.75,
                      transition: 'background 0.2s',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: lora.style.fontFamily,
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isActive ? '#fff' : '#c084fc',
                        lineHeight: 1,
                      }}
                    >
                      {friendsCount}
                    </Typography>
                  </Box>
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
