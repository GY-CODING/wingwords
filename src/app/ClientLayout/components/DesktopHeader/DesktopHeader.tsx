import { CustomButton } from '@/app/components/atoms/CustomButton/customButton';
import { LocaleSwitcher } from '@/app/components/atoms/LocaleSwitcher/LocaleSwitcher';
import { CHANGELOG_VERSIONS } from '@/app/changelog/constants/changelog.constants';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { User } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import InboxIcon from '@mui/icons-material/Inbox';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProfileButton } from '../ProfileButton/ProfileButton';

const LATEST_VERSION = CHANGELOG_VERSIONS[0].version;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;
const MotionIconButton = motion(IconButton);

interface DesktopHeaderProps {
  user: User | null;
  isLoading: boolean;
  friendRequestsCount: number;
  isLoadingRequests: boolean;
  onFriendRequestsClick: () => void;
}

/**
 * Header para versión desktop
 * Muestra logo, botones de navegación, notificaciones y perfil
 */
export const DesktopHeader = ({
  user,
  isLoading,
  friendRequestsCount,
  isLoadingRequests,
  onFriendRequestsClick,
}: DesktopHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Box
      suppressHydrationWarning={true}
      sx={{
        position: 'fixed',
        display: ['none', 'none', 'flex'],
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
      }}
    >
      {/* Logo + version chip */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <MotionBox
          component="img"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.3))',
            transition: 'filter 0.3s ease',
          }}
          onClick={() => router.push('/')}
          src="/gy-logo.png"
          alt="logo"
        />
        {user && (
          <Chip
            component={Link}
            href="/changelog"
            label={`v${LATEST_VERSION}`}
            size="small"
            clickable
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.7rem',
              fontWeight: 600,
              height: 24,
              background: 'rgba(168,85,247,0.1)',
              color: 'rgba(192,132,252,0.8)',
              border: '1px solid rgba(168,85,247,0.25)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(168,85,247,0.2)',
                color: '#c084fc',
                borderColor: 'rgba(168,85,247,0.5)',
              },
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'end',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CustomButton
          variant="outlined"
          onClick={() => router.push('/books')}
          sx={{
            borderColor: '#9333ea',
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: '14px',
            letterSpacing: '0.1rem',
            height: '10px',
            py: '1.3rem',
            fontFamily: lora.style.fontFamily,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#a855f7',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
            },
          }}
          startIcon={<LocalLibraryIcon />}
        >
          {t('nav.library')}
        </CustomButton>

        <CustomButton
          variant="outlined"
          onClick={() => router.push('/users/community')}
          sx={{
            borderColor: '#9333ea',
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: '14px',
            letterSpacing: '0.1rem',
            height: '10px',
            py: '1.3rem',
            fontFamily: lora.style.fontFamily,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#a855f7',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
            },
          }}
          startIcon={<PersonIcon />}
        >
          {t('nav.community')}
        </CustomButton>

        {/* Friend Requests */}
        {user && (
          <MotionIconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFriendRequestsClick}
            sx={{
              color: isLoadingRequests
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0.5)',
              transition: 'color 0.25s ease',
              '&:hover': {
                color: '#c084fc',
                backgroundColor: 'rgba(192, 132, 252, 0.08)',
              },
            }}
          >
            <InboxIcon sx={{ fontSize: '22px' }} />
            {friendRequestsCount > 0 && (
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: '16px',
                  height: '16px',
                  background:
                    'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(147, 51, 234, 0.4)',
                }}
              >
                {friendRequestsCount}
              </MotionBox>
            )}
          </MotionIconButton>
        )}

        {/* Profile/Login Button */}
        <LocaleSwitcher />
        <ProfileButton user={user} isLoading={isLoading} />
      </Box>
    </Box>
  );
};
