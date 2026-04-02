/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import {
  GyCodingUserProvider,
  useGyCodingUser,
} from '@/contexts/GyCodingUserContext';
import { useUser } from '@/hooks/useUser';
import store from '@/store';
import { getTheme } from '@/styles/theme';
import { ESeverity } from '@/utils/constants/ESeverity';
import { ETheme } from '@/utils/constants/theme.enum';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useFriendRequestsPanel } from './ClientLayout/hooks/useFriendRequestsPanel';
import { useHeaderScroll } from './ClientLayout/hooks/useHeaderScroll';
import AnimatedAlert from './components/atoms/Alert/Alert';

import { DesktopHeader } from './ClientLayout/components/DesktopHeader/DesktopHeader';
import { FriendRequestsPanel } from './ClientLayout/components/FriendRequestsPanel/FriendRequestsPanel';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import {
  BOTTOM_NAV_HEIGHT,
  MobileBottomNav,
} from './ClientLayout/components/MobileBottomNav';
import { MobileTopBar } from './ClientLayout/components/MobileTopBar/MobileTopBar';

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  useUser(); // Fetch and store profile in Redux
  const { user, isLoading } = useGyCodingUser();
  const [isHydrated, setIsHydrated] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Custom hooks
  const { scrolled } = useHeaderScroll();
  const friendRequestsPanel = useFriendRequestsPanel(user?.id as UUID);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // height: ['100dvh', '100vh'],
          overflow: ['hidden', 'auto'],
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* Header Container */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: '56px', md: '80px' },
            backgroundColor: scrolled
              ? 'rgba(10, 10, 10, 0.92)'
              : 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: scrolled
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid transparent',
            boxShadow: scrolled ? '0 1px 12px rgba(0, 0, 0, 0.3)' : 'none',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            transition: 'all 0.3s ease',
          }}
        >
          {!isHydrated ? (
            <Box
              sx={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: { xs: '36px', md: '48px' },
                  height: { xs: '36px', md: '48px' },
                  filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))',
                }}
                src="/gy-logo.png"
                alt="logo"
              />
            </Box>
          ) : isMobile ? (
            <MobileTopBar
              user={user}
              isLoading={isLoading}
              friendRequestsCount={friendRequestsPanel.count}
              onFriendRequestsClick={friendRequestsPanel.toggle}
            />
          ) : (
            <DesktopHeader
              user={user}
              isLoading={isLoading}
              friendRequestsCount={friendRequestsPanel.count}
              isLoadingRequests={friendRequestsPanel.isLoadingRequests}
              onFriendRequestsClick={friendRequestsPanel.toggle}
            />
          )}
        </Box>

        {/* Friend Requests Panel */}
        <FriendRequestsPanel
          isOpen={friendRequestsPanel.isOpen}
          isLoading={friendRequestsPanel.isLoadingRequests}
          isLoadingUsers={friendRequestsPanel.isLoadingUsers}
          isLoadingManageRequest={friendRequestsPanel.isLoadingManageRequest}
          friendRequestsWithUsers={friendRequestsPanel.friendRequestsWithUsers}
          onClose={friendRequestsPanel.close}
          onManageRequest={friendRequestsPanel.handleManageRequest}
        />

        {/* Mobile Bottom Nav */}
        {isMobile && isHydrated && (
          <MobileBottomNav
            friendRequestsCount={friendRequestsPanel.count}
            isLoggedIn={!!user}
          />
        )}

        {/* Main Content */}
        <Box
          suppressHydrationWarning={true}
          sx={{
            mt: { xs: '56px', md: '80px' },
            pb: {
              xs: isMobile && isHydrated ? `${BOTTOM_NAV_HEIGHT}px` : 0,
              md: 0,
            },
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>

        {/* Alerts */}
        <AnimatedAlert
          open={friendRequestsPanel.errorManageRequest}
          onClose={friendRequestsPanel.handleCloseErrorAlert}
          severity={ESeverity.ERROR}
          message="Error managing request"
        />
        <AnimatedAlert
          open={friendRequestsPanel.isSuccessManageRequest}
          onClose={friendRequestsPanel.handleCloseSuccessAlert}
          severity={ESeverity.SUCCESS}
          message="Request managed successfully"
        />
      </Box>
    </ThemeProvider>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <I18nProvider>
        <Auth0Provider>
          <GyCodingUserProvider>
            <ClientLayoutContent>{children}</ClientLayoutContent>
          </GyCodingUserProvider>
        </Auth0Provider>
      </I18nProvider>
    </Provider>
  );
}
