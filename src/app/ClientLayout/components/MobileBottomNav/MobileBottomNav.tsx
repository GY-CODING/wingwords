'use client';

import { useTranslation } from '@/lib/i18n/I18nProvider';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import {
  BOTTOM_NAV_ITEMS_LOGGED_IN,
  BOTTOM_NAV_ITEMS_LOGGED_OUT,
  BOTTOM_NAV_SAFE_AREA_PADDING,
} from './MobileBottomNav.constants';

const MotionBox = motion(Box);

/**
 * Pill indicator animada encima del icono activo.
 * Se renderiza solo en el item seleccionado.
 */
const ActiveIndicator: React.FC = () => (
  <MotionBox
    layoutId="bottomNavIndicator"
    initial={false}
    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
    sx={{
      position: 'absolute',
      top: 0,
      width: 24,
      height: 3,
      borderRadius: 2,
      background: 'linear-gradient(90deg, #9333ea, #c084fc)',
      boxShadow: '0 0 6px rgba(147, 51, 234, 0.3)',
    }}
  />
);

interface NavItemProps {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

/**
 * Item individual del bottom nav.
 * Memoizado para evitar re-renders innecesarios.
 */
const NavItem = React.memo<NavItemProps>(
  ({ label, icon: Icon, isActive, onClick, badge }) => {
    return (
      <Box
        component="button"
        onClick={onClick}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.25,
          py: 1,
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          minHeight: 48,
        }}
      >
        {isActive && <ActiveIndicator />}

        <Box sx={{ position: 'relative' }}>
          <Icon
            sx={{
              fontSize: 22,
              color: isActive ? '#c084fc' : 'rgba(255, 255, 255, 0.45)',
              transition: 'color 0.2s ease',
            }}
          />
          {badge !== undefined && badge > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -6,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {badge > 9 ? '9+' : badge}
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: '0.6rem',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#c084fc' : 'rgba(255, 255, 255, 0.4)',
            transition: 'color 0.2s ease',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  }
);

NavItem.displayName = 'NavItem';

interface MobileBottomNavProps {
  friendRequestsCount?: number;
  isLoggedIn?: boolean;
}

/**
 * Bottom navigation bar para mobile.
 * Estilo glassmorphism con indicador animado tipo iOS.
 * Se adapta al safe area de dispositivos con home indicator.
 * Muestra items diferentes según si el usuario está logueado.
 */
export const MobileBottomNav = React.memo<MobileBottomNavProps>(
  ({ friendRequestsCount = 0, isLoggedIn = false }) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();

    const navItems = useMemo(
      () =>
        isLoggedIn ? BOTTOM_NAV_ITEMS_LOGGED_IN : BOTTOM_NAV_ITEMS_LOGGED_OUT,
      [isLoggedIn]
    );

    const activeIndex = useMemo(() => {
      if (pathname === '/') return 0;
      return navItems.findIndex(
        (item, i) => i > 0 && pathname.startsWith(item.route)
      );
    }, [pathname, navItems]);

    const handleNavClick = useCallback(
      (route: string) => {
        router.push(route);
      },
      [router]
    );

    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          // Glassmorphism
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          // Safe area
          paddingBottom: BOTTOM_NAV_SAFE_AREA_PADDING,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            maxWidth: 400,
            margin: '0 auto',
            px: 1,
          }}
        >
          {navItems.map((item, index) => (
            <NavItem
              key={item.labelKey}
              label={t(item.labelKey)}
              icon={item.icon}
              isActive={activeIndex === index}
              onClick={() => handleNavClick(item.route)}
              badge={
                item.route === '/users/community'
                  ? friendRequestsCount
                  : undefined
              }
            />
          ))}
        </Box>
      </Box>
    );
  }
);

MobileBottomNav.displayName = 'MobileBottomNav';
