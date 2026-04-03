'use client';

import { useAnimations } from '@/hooks/useAnimations';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { HERO_STATS } from '@/utils/constants/homepage.constants';
import { birthStone, lora } from '@/utils/fonts/fonts';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

/**
 * Hero section de la página principal
 * Muestra el título, descripción y CTAs principales
 */
export const Hero = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { fadeInUp, fadeIn, backgroundGradient } = useAnimations();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background gradients */}
      <MotionBox
        variants={backgroundGradient}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <MotionBox
        variants={backgroundGradient}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        sx={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Title */}
        <MotionTypography
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          variant="h1"
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '4rem', sm: '5rem', md: '7rem' },
            fontWeight: '800',
            fontFamily: birthStone.style.fontFamily,
            lineHeight: 1.1,
            mb: 2,
            paddingBottom: '10px',
          }}
        >
          WingWords
        </MotionTypography>

        {/* Subtitle */}
        <MotionTypography
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          variant="h5"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '700px',
            lineHeight: 1.7,
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            px: { xs: 2, sm: 0 },
          }}
        >
          {t('landing.hero.subtitle')}
        </MotionTypography>

        {/* Stats */}
        <MotionBox
          initial="initial"
          animate="animate"
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            display: 'flex',
            gap: { xs: 3, sm: 6 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            my: 2,
          }}
        >
          {HERO_STATS.map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#a855f7',
                  fontWeight: '700',
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                }}
              >
                {stat.valueKey ? t(stat.valueKey) : stat.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {t(stat.labelKey)}
              </Typography>
            </Box>
          ))}
        </MotionBox>

        <MotionBox
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/books')}
            startIcon={<MenuBookIcon />}
            sx={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontFamily: lora.style.fontFamily,
              fontWeight: 'bold',
              letterSpacing: '.05rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(147, 51, 234, 0.3)',
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              },
            }}
          >
            {t('landing.hero.button.explore')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/users/community')}
            startIcon={<GroupsIcon />}
            sx={{
              borderColor: '#9333ea',
              borderWidth: '2px',
              color: 'white',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontFamily: lora.style.fontFamily,
              fontWeight: 'bold',
              letterSpacing: '.05rem',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#a855f7',
                borderWidth: '2px',
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {t('landing.hero.button.join')}
          </Button>
        </MotionBox>

        {/* See Features Badge */}
        <MotionBox
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{ mt: 3 }}
        >
          <Box
            component={Link}
            href="/changelog"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1.2,
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none !important',
              '&:hover': {
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)',
                border: '1px solid rgba(147, 51, 234, 0.5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                textDecoration: 'none !important',
              },
              '&:visited': {
                textDecoration: 'none !important',
              },
              '& *': {
                textDecoration: 'none !important',
              },
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                boxShadow: '0 0 6px rgba(147, 51, 234, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.6, transform: 'scale(1.2)' },
                },
              }}
            />
            <Typography
              sx={{
                color: '#a855f7',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {t('landing.hero.badge')}
            </Typography>
            <Box
              component="span"
              sx={{
                color: '#a855f7',
                fontSize: '1.2rem',
                lineHeight: 1,
                transition: 'transform 0.3s ease',
                '.MuiBox-root:hover &': {
                  transform: 'translateX(3px)',
                },
              }}
            >
              →
            </Box>
          </Box>
        </MotionBox>

        {/* Decorative icons */}
        <MotionBox
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            position: 'absolute',
            top: '10%',
            left: { xs: '5%', md: '15%' },
            fontSize: '3rem',
            color: '#9333ea',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <MenuBookIcon sx={{ fontSize: 'inherit' }} />
        </MotionBox>
        <MotionBox
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: { xs: '5%', md: '15%' },
            fontSize: '2.5rem',
            color: '#a855f7',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <RateReviewIcon sx={{ fontSize: 'inherit' }} />
        </MotionBox>
      </Box>
    </Box>
  );
};
