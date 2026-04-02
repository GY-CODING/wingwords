'use client';

import { UserAvatar } from '@/app/components/atoms/UserAvatar';
import { LocaleSwitcher } from '@/app/components/atoms/LocaleSwitcher/LocaleSwitcher';
import { User } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { Badge, Box, IconButton, Skeleton, Typography } from '@mui/material';
import React from 'react';

interface MobileTopBarProps {
  user: User | null;
  isLoading: boolean;
  friendRequestsCount: number;
  onFriendRequestsClick: () => void;
}

/**
 * Top bar minimalista para mobile.
 * Muestra el logo + nombre de la app a la izquierda,
 * icono de solicitudes de amistad + avatar del usuario a la derecha.
 * Estilo glassmorphism consistente con el bottom nav.
 */
export const MobileTopBar = React.memo<MobileTopBarProps>(
  ({ user, isLoading, friendRequestsCount, onFriendRequestsClick }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Logo + Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/gy-logo.png"
            alt="WingWords"
            sx={{
              width: 36,
              height: 36,
              filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))',
            }}
          />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
            }}
          >
            WingWords
          </Typography>
        </Box>

        {/* Right side: Friend Requests + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Friend Requests Icon - only when logged in */}
          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                minWidth: 44,
                minHeight: 44,
                p: 0,
                m: 0,
                position: 'relative',
                background: 'rgba(255,255,255,0.02)',
                transition: 'background 0.2s',
                '&:active': {
                  background: 'rgba(147, 51, 234, 0.08)',
                },
              }}
            >
              <IconButton
                onClick={onFriendRequestsClick}
                size="large"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  p: 1.2,
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  position: 'relative',
                  WebkitTapHighlightColor: 'transparent',
                  '&:active': {
                    color: '#c084fc',
                    background: 'rgba(147, 51, 234, 0.08)',
                  },
                }}
                aria-label="Abrir solicitudes de amistad"
              >
                <Badge
                  badgeContent={friendRequestsCount}
                  max={9}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#9333ea',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      padding: '0 5px',
                      boxShadow: '0 1px 4px rgba(147,51,234,0.18)',
                    },
                  }}
                >
                  <InboxRoundedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Box>
          )}

          {/* User Avatar */}
          <LocaleSwitcher />
          {isLoading ? (
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)' }}
            />
          ) : user ? (
            <UserAvatar
              src={user.picture}
              alt={user.username || 'User'}
              size={32}
              sx={{
                border: '1.5px solid rgba(147, 51, 234, 0.4)',
              }}
            />
          ) : (
            <Box sx={{ width: 32, height: 32 }} />
          )}
        </Box>
      </Box>
    );
  }
);

MobileTopBar.displayName = 'MobileTopBar';
