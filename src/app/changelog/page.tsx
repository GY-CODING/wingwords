'use client';

import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Chip,
  Container,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import {
  CHANGELOG_VERSIONS,
  type ChangelogVersion,
} from './constants/changelog.constants';

const MotionBox = motion(Box);

// ── Decorative vertical timeline line ──────────────────────────────────────
const TimelineLine: React.FC = () => (
  <Box
    sx={{
      position: 'absolute',
      left: { xs: 20, sm: 28 },
      top: 0,
      bottom: 0,
      width: '2px',
      background:
        'linear-gradient(180deg, rgba(147, 51, 234, 0.6) 0%, rgba(147, 51, 234, 0.1) 100%)',
      borderRadius: 1,
    }}
  />
);

// ── Version dot on the timeline ─────────────────────────────────────────────
const TimelineDot: React.FC<{ isLatest?: boolean }> = ({ isLatest }) => (
  <Box
    sx={{
      position: 'absolute',
      left: { xs: 11, sm: 19 },
      top: 8,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: isLatest
        ? 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)'
        : 'rgba(147, 51, 234, 0.3)',
      border: isLatest
        ? '2px solid rgba(168, 85, 247, 0.8)'
        : '2px solid rgba(147, 51, 234, 0.4)',
      boxShadow: isLatest ? '0 0 12px rgba(147, 51, 234, 0.5)' : 'none',
      zIndex: 1,
    }}
  />
);

// ── Single version card ──────────────────────────────────────────────────────
interface VersionCardProps {
  entry: ChangelogVersion;
  index: number;
}

const VersionCard: React.FC<VersionCardProps> = ({ entry, index }) => {
  const { t } = useTranslation();

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      sx={{ position: 'relative', pl: { xs: 7, sm: 9 }, mb: { xs: 4, sm: 6 } }}
    >
      <TimelineDot isLatest={entry.isLatest} />

      {/* Card */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: entry.isLatest
            ? '1px solid rgba(147, 51, 234, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          p: { xs: 2.5, sm: 3.5 },
          boxShadow: entry.isLatest
            ? '0 0 30px rgba(147, 51, 234, 0.08)'
            : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(147, 51, 234, 0.4)',
            boxShadow: '0 4px 24px rgba(147, 51, 234, 0.1)',
          },
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: { xs: '1.4rem', sm: '1.7rem' },
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}
          >
            v{entry.version}
          </Typography>

          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.2,
            }}
          >
            {t(entry.titleMessageId)}
          </Typography>

          {entry.isLatest && (
            <Chip
              label={t('changelog.badge.latest')}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
                letterSpacing: '0.04em',
                textDecoration: 'none !important',
                '& .MuiChip-label': {
                  textDecoration: 'none !important',
                },
              }}
            />
          )}
        </Box>

        {/* Date */}
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.85rem',
            color: 'rgba(168, 85, 247, 0.8)',
            fontWeight: 500,
            mb: 2,
          }}
        >
          {t(entry.dateMessageId)}
        </Typography>

        {/* Intro text */}
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            color: 'rgba(255,255,255,0.6)',
            mb: 2.5,
            lineHeight: 1.7,
          }}
        >
          {t(entry.introMessageId)}
        </Typography>

        {/* Feature list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {entry.features.map((feature, fi) => {
            const FeatureIcon = feature.icon;
            return (
              <Box
                key={fi}
                sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
              >
                <Box
                  sx={{
                    mt: '2px',
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: 'rgba(147, 51, 234, 0.12)',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FeatureIcon sx={{ fontSize: 15, color: '#a855f7' }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.65,
                  }}
                >
                  {t(feature.messageId)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </MotionBox>
  );
};

// ── Page ────────────────────────────────────────────────────────────────────
export default function ChangelogPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '0%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 3, sm: 4 },
          pb: { xs: 6, sm: 10 },
        }}
      >
        {/* Back button */}
        <MotionBox
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mb: 2 }}
        >
          <Tooltip title="Back">
            <IconButton
              component={Link}
              href="/"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#a855f7',
                  borderColor: 'rgba(147,51,234,0.4)',
                  background: 'rgba(147,51,234,0.08)',
                },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </MotionBox>

        {/* Page header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          sx={{ mb: { xs: 6, sm: 10 }, textAlign: 'center' }}
        >
          <Typography
            variant="h1"
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem' },
              fontWeight: 800,
              lineHeight: 1,
              mb: 2,
              pb: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            {t('changelog.title')}
          </Typography>
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: '1rem', sm: '1.15rem' },
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
            }}
          >
            {t('changelog.subtitle')}
          </Typography>
        </MotionBox>

        {/* Timeline */}
        <Box sx={{ position: 'relative' }}>
          <TimelineLine />
          {CHANGELOG_VERSIONS.map((entry, index) => (
            <VersionCard key={entry.version} entry={entry} index={index} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
