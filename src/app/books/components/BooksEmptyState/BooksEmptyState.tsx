'use client';

import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import LottieAnimation from '@/app/components/atoms/LottieAnimation/LottieAnimation';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

interface BooksEmptyStateProps {
  hasSearched: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

function EmptyFeedback({
  icon,
  title,
  subtitle,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        py: { xs: 6, sm: 8 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          background: 'rgba(147,51,234,0.1)',
          border: '1px solid rgba(147,51,234,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a855f7',
          mb: 0.5,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          fontWeight: 600,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
          color: 'rgba(255,255,255,0.35)',
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </Typography>
      {action && onAction && (
        <Typography
          onClick={onAction}
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.85rem',
            color: '#a855f7',
            cursor: 'pointer',
            mt: 0.5,
            borderBottom: '1px solid rgba(168,85,247,0.4)',
            pb: '1px',
            transition: 'color 0.2s, border-color 0.2s',
            '&:hover': {
              color: '#c084fc',
              borderColor: 'rgba(192,132,252,0.6)',
            },
          }}
        >
          {action}
        </Typography>
      )}
    </MotionBox>
  );
}

export const BooksEmptyState: React.FC<BooksEmptyStateProps> = ({
  hasSearched,
  hasActiveFilters,
  onResetFilters,
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/lottie/book_searcher.json')
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  if (hasSearched && hasActiveFilters) {
    return (
      <EmptyFeedback
        icon={<TuneIcon />}
        title={t('library.empty.noFiltersMatch.title')}
        subtitle={t('library.empty.noFiltersMatch.subtitle')}
        action={t('library.empty.noFiltersMatch.action')}
        onAction={onResetFilters}
      />
    );
  }

  if (hasSearched) {
    return (
      <EmptyFeedback
        icon={<SearchOffIcon />}
        title={t('library.empty.noResults.title')}
        subtitle={t('library.empty.noResults.subtitle')}
      />
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 2, sm: 4 },
        gap: 1,
      }}
    >
      {animationData && (
        <LottieAnimation
          loop
          animationData={animationData}
          style={{ width: '340px', height: '340px', maxWidth: '80vw' }}
        />
      )}
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: '0.9rem', sm: '1rem' },
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'center',
          mt: -1,
        }}
      >
        {t('library.empty.initial')}
      </Typography>
    </MotionBox>
  );
};
