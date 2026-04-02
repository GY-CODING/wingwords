'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { FEATURES } from '@/utils/constants/homepage.constants';
import { useAnimations } from '@/hooks/useAnimations';
import { FeatureCard } from '@/app/components/atoms/FeatureCard';
import { useTranslation } from '@/lib/i18n/I18nProvider';

const MotionBox = motion(Box);

/**
 * Grid de características principales de WingWords
 * Muestra las 6 funcionalidades principales de la aplicación
 */
export const FeaturesGrid = () => {
  const { t } = useTranslation();
  const { containerStagger } = useAnimations();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Section Title */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        sx={{ textAlign: 'center', mb: 8 }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontFamily: lora.style.fontFamily,
            fontWeight: '700',
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            letterSpacing: '0.02rem',
          }}
        >
          {t('landing.features.section.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '1rem', md: '1.2rem' },
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          {t('landing.features.section.subtitle')}
        </Typography>
      </MotionBox>

      <MotionBox
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerStagger}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 3, md: 4 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={{
              icon: feature.icon,
              color: feature.color,
              title: t(feature.titleKey),
              description: t(feature.descriptionKey),
            }}
          />
        ))}
      </MotionBox>
    </Box>
  );
};
