import { CustomButton } from '@/app/components/atoms/CustomButton/customButton';
import Profile from '@/app/components/organisms/Profile';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { User } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

interface ProfileButtonProps {
  user: User | null;
  isLoading: boolean;
}

/**
 * Componente que renderiza el botón de perfil o login
 * según el estado de autenticación
 */
export const ProfileButton = ({ user, isLoading }: ProfileButtonProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          height: '48px',
        }}
      >
        <Skeleton
          variant="circular"
          sx={{
            width: '48px',
            height: '48px',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>
    );
  }

  if (user) {
    return <Profile user={user} />;
  }

  return (
    <a href="/auth/login" style={{ textDecoration: 'none' }}>
      <CustomButton
        component={motion.button}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
          color: 'white',
          fontSize: '14px',
          letterSpacing: '0.1rem',
          height: '10px',
          py: '1.3rem',
          fontFamily: lora.style.fontFamily,
          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(147, 51, 234, 0.35)',
          },
        }}
      >
        {t('nav.login')}
      </CustomButton>
    </a>
  );
};
