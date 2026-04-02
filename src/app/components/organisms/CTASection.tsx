'use client';

import { useAnimations } from '@/hooks/useAnimations';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { CTA_FEATURE_KEYS } from '@/utils/constants/homepage.constants';
import { lora } from '@/utils/fonts/fonts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import { Box, Button, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionBox = motion(Box);

/**
 * Call To Action section para conectar con otros lectores
 * Anima a los usuarios a unirse a la comunidad
 */
export const CTASection = () => {
  const { t } = useTranslation();
  const { fadeIn, scaleIn } = useAnimations();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, md: 10 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background gradient */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      {/* Content Card */}
      <MotionBox
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={scaleIn}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          width: '100%',
          p: { xs: 4, md: 6 },
          borderRadius: '24px',
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background:
              'linear-gradient(90deg, transparent, #9333ea, #a855f7, transparent)',
          },
        }}
      >
        {/* Icon */}
        <MotionBox
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '80px', md: '100px' },
            height: { xs: '80px', md: '100px' },
            margin: '0 auto',
            borderRadius: '20px',
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '2px solid rgba(147, 51, 234, 0.4)',
            mb: 3,
          }}
        >
          <GroupsIcon
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              color: '#a855f7',
            }}
          />
        </MotionBox>

        {/* Title */}
        <MotionBox
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: '700',
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              mb: 2,
              letterSpacing: '0.02rem',
            }}
          >
            {t('landing.cta.title')}
          </Typography>
        </MotionBox>

        {/* Description */}
        <MotionBox
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.7,
              mb: 4,
              px: { xs: 0, md: 4 },
            }}
          >
            {t('landing.cta.description')}
          </Typography>
        </MotionBox>

        {/* Features List */}
        <MotionBox
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mb: 4,
          }}
        >
          {CTA_FEATURE_KEYS.map((key, index) => (
            <Chip
              key={index}
              icon={<CheckCircleIcon sx={{ color: '#a855f7 !important' }} />}
              label={t(key)}
              sx={{
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '0.9rem', md: '1rem' },
                py: 2.5,
                px: 1,
                '& .MuiChip-icon': {
                  color: '#a855f7',
                },
              }}
            />
          ))}
        </MotionBox>

        {/* CTA Button */}
        <MotionBox
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link style={{ textDecoration: 'none' }} href="/users/community">
            <Button
              variant="contained"
              size="large"
              startIcon={<GroupsIcon />}
              sx={{
                background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                color: 'white',
                padding: { xs: '1rem 2rem', md: '1.2rem 3rem' },
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontFamily: lora.style.fontFamily,
                fontWeight: 'bold',
                letterSpacing: '.05rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(147, 51, 234, 0.3)',
                  background:
                    'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                },
              }}
            >
              {t('landing.cta.button')}
            </Button>
          </Link>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};
