import FriendRequest from '@/app/components/atoms/FriendRequest/FriendRequest';
import { FriendRequestWithUser } from '@/domain/friend.model';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import { ECommands } from '@/utils/constants/ECommands';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface FriendRequestsPanelProps {
  isOpen: boolean;
  isLoading: boolean;
  isLoadingUsers: boolean;
  isLoadingManageRequest: (requestId: string) => boolean;
  friendRequestsWithUsers: FriendRequestWithUser[];
  onClose: () => void;
  onManageRequest: (requestId: string, command: ECommands) => Promise<void>;
}

/**
 * Panel flotante que muestra las solicitudes de amistad
 * Aparece desde la parte superior derecha con animación
 */
export const FriendRequestsPanel = ({
  isOpen,
  isLoading,
  isLoadingUsers,
  isLoadingManageRequest,
  friendRequestsWithUsers,
  onClose,
  onManageRequest,
}: FriendRequestsPanelProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para cerrar la pestaña flotante */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
          touchAction: 'manipulation',
        }}
      />

      {/* Pestaña flotante de solicitudes de amistad */}
      <AnimatePresence>
        <MotionBox
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'fixed',
            top: { xs: '60px', md: '80px' },
            right: { xs: '10px', md: '20px' },
            left: { xs: '10px', md: 'auto' },
            width: { xs: 'auto', md: '460px' },
            maxHeight: { xs: '70vh', md: '520px' },
            zIndex: 999,
            background: 'rgba(10, 10, 14, 0.97)',
            backdropFilter: 'blur(24px)',
            borderRadius: '16px',
            border: '1px solid rgba(147, 51, 234, 0.18)',
            boxShadow:
              '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,51,234,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Accent line top */}
          <Box
            sx={{
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(147,51,234,0.6), rgba(192,132,252,0.4), transparent)',
            }}
          />

          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: 1.75,
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(147, 51, 234, 0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <PersonAddIcon
                sx={{ fontSize: '18px', color: 'rgba(192, 132, 252, 0.8)' }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: 15, md: 17 },
                  letterSpacing: '0.02rem',
                }}
              >
                {t('friends.requests.title')}
              </Typography>
              {(friendRequestsWithUsers?.length ?? 0) > 0 && (
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #9333ea, #a855f7)',
                    borderRadius: '10px',
                    px: 0.9,
                    py: 0.1,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1.6,
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {friendRequestsWithUsers.length}
                </Box>
              )}
            </Box>
            <MotionIconButton
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              sx={{
                color: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  color: 'white',
                  background: 'rgba(255,255,255,0.06)',
                },
              }}
              size="small"
            >
              <CloseIcon sx={{ fontSize: '18px' }} />
            </MotionIconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              overflowY: 'auto',
              p: 1.5,
              maxHeight: { xs: 'calc(70vh - 60px)', md: '456px' },
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(147, 51, 234, 0.25)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(147, 51, 234, 0.45)',
              },
            }}
          >
            {isLoading || isLoadingUsers ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress
                  size={28}
                  sx={{ color: 'rgba(147,51,234,0.7)' }}
                />
              </Box>
            ) : friendRequestsWithUsers &&
              friendRequestsWithUsers.length > 0 ? (
              friendRequestsWithUsers.map((requestWithUser, index) => (
                <MotionBox
                  key={requestWithUser.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.25 }}
                  sx={{ mb: 1.25 }}
                >
                  <FriendRequest
                    user={requestWithUser.user || null}
                    handleManageRequest={onManageRequest}
                    isLoadingManageRequest={isLoadingManageRequest}
                    requestId={requestWithUser.id}
                  />
                </MotionBox>
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  py: 5,
                  px: 2,
                }}
              >
                <PersonAddIcon
                  sx={{ fontSize: '36px', color: 'rgba(147,51,234,0.25)' }}
                />
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  {t('friends.requests.empty')}
                </Typography>
              </Box>
            )}
          </Box>
        </MotionBox>
      </AnimatePresence>
    </>
  );
};
