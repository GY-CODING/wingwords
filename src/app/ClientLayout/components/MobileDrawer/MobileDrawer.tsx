import { MenuItem } from '@/domain/menu.model';
import { User } from '@/domain/user.model';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import CloseIcon from '@mui/icons-material/Close';
import InboxIcon from '@mui/icons-material/Inbox';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface MobileDrawerProps {
  isOpen: boolean;
  user: User | null;
  menuItems: MenuItem[];
  friendRequestsCount: number;
  onClose: () => void;
  onLogoClick: () => void;
  onMenuItemClick: (route: string) => void;
  onFriendRequestsClick: () => void;
}

/**
 * Drawer móvil con menú de navegación.
 * Incluye logo, items del menú, solicitudes de amistad y logout.
 *
 * Envuelto en React.memo para evitar re-renders innecesarios cuando
 * el layout padre se actualiza por datos del dashboard (actividades,
 * libros, friend requests loading, etc.) que no afectan al drawer.
 */
export const MobileDrawer = React.memo(
  ({
    isOpen,
    user,
    menuItems,
    friendRequestsCount,
    onClose,
    onLogoClick,
    onMenuItemClick,
    onFriendRequestsClick,
  }: MobileDrawerProps) => {
    const { t } = useTranslation();
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            background:
              'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(30, 10, 40, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            width: 300,
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header del drawer */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
              pb: 2,
              borderBottom: '1px solid rgba(147, 51, 234, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MotionBox
                component="img"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
                }}
                onClick={onLogoClick}
                src="/gy-logo.png"
                alt="logo"
              />
            </Box>
            <MotionIconButton
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              sx={{ color: '#fff' }}
            >
              <CloseIcon />
            </MotionIconButton>
          </Box>

          {/* Menu Items */}
          <List sx={{ flex: 1, py: 0 }}>
            {menuItems.map((item, index) => (
              <MotionBox
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <ListItem
                  onClick={() => onMenuItemClick(item.route)}
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    mb: 1.5,
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#a855f7',
                      minWidth: '45px',
                      filter: 'none',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                        fontFamily: lora.style.fontFamily,
                        fontSize: 16,
                        letterSpacing: '0.02em',
                      },
                    }}
                  />
                </ListItem>
              </MotionBox>
            ))}
          </List>

          {/* Friend Requests Button */}
          {user && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <ListItem
                onClick={onFriendRequestsClick}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  mb: 2,
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background:
                    friendRequestsCount > 0
                      ? 'rgba(147, 51, 234, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${friendRequestsCount > 0 ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                  '&:hover': {
                    background: 'rgba(147, 51, 234, 0.15)',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    transform: 'translateX(8px) scale(1.02)',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#a855f7',
                    minWidth: '45px',
                    filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.4))',
                    position: 'relative',
                  }}
                >
                  <InboxIcon />
                  {friendRequestsCount > 0 && (
                    <MotionBox
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 15,
                      }}
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: '20px',
                        height: '20px',
                        background:
                          'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(147, 51, 234, 0.6)',
                      }}
                    >
                      {friendRequestsCount}
                    </MotionBox>
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={t('friends.requests.title')}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      fontFamily: lora.style.fontFamily,
                      fontSize: 16,
                      letterSpacing: '0.02em',
                    },
                  }}
                />
              </ListItem>
            </MotionBox>
          )}

          {/* Logout Button */}
          {user && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <a href="/auth/logout" style={{ textDecoration: 'none' }}>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    borderColor: 'rgba(255, 100, 100, 0.3)',
                    color: 'rgba(255, 100, 100, 0.7)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 100, 100, 0.1)',
                      borderColor: 'rgba(255, 100, 100, 0.5)',
                      boxShadow: 'none',
                    },
                  }}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </a>
            </MotionBox>
          )}
        </Box>
      </Drawer>
    );
  }
);

MobileDrawer.displayName = 'MobileDrawer';
