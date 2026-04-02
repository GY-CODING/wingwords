/* eslint-disable no-constant-binary-expression */
'use client';

import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUpdateHallOfFame } from '@/hooks/useUpdateHallOfFame';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import { ESeverity } from '@/utils/constants/ESeverity';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { HallOfFameSkeleton } from './HallOfFameSkeleton';
import { HallOfFameCarousel } from './halloffame/HallOfFameCarousel';
import { HallOfFameEmpty } from './halloffame/HallOfFameEmpty';
import { HallOfFameQuoteInput } from './halloffame/HallOfFameQuoteInput';

const MotionBox = motion(Box);

export default function HallOfFame({ userId }: { userId: string }) {
  const { user } = useGyCodingUser();
  const { t } = useTranslation();
  const { isLoading, error, quote, books } = useHallOfFame(userId);
  const {
    handleUpdateHallOfFame,
    isUpdated,
    isError: isUpdateError,
    setIsUpdated,
    setIsError: setIsUpdateError,
  } = useUpdateHallOfFame(userId);

  const [editedQuote, setEditedQuote] = useState(quote);
  const [isEditing, setIsEditing] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    setEditedQuote(quote || '');
  }, [quote]);

  if (isLoading) return <HallOfFameSkeleton />;

  if (error) {
    return (
      <Box sx={{ color: 'white', textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="white">
          {t('hallOfFame.error.load')}
        </Typography>
      </Box>
    );
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('quote', editedQuote);
      await handleUpdateHallOfFame(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const isOwnProfile = userId === user?.id;

  // Si books es undefined o array vacío
  if (!books || books.length === 0) {
    const hasQuote = !!quote?.trim();
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: '1.5rem',
        }}
      >
        <HallOfFameEmpty isOwnProfile={isOwnProfile} />
        {(isOwnProfile || hasQuote) && (
          <HallOfFameQuoteInput
            quote={quote || ''}
            editedQuote={editedQuote}
            setEditedQuote={setEditedQuote}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleUpdate}
            disabled={!isOwnProfile}
          />
        )}
        <AnimatedAlert
          open={isUpdated}
          message={t('hallOfFame.quote.updated')}
          severity={ESeverity.SUCCESS}
          onClose={() => setIsUpdated(false)}
        />
        <AnimatedAlert
          open={isUpdateError}
          message={t('hallOfFame.quote.updateError')}
          severity={ESeverity.ERROR}
          onClose={() => setIsUpdateError(false)}
        />
      </Box>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,158,11,0.14)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.75rem',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '120px',
          background:
            'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WorkspacePremiumIcon
            sx={{ color: 'rgba(245,158,11,0.7)', fontSize: 22 }}
          />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              background:
                'linear-gradient(135deg, #ffffff 20%, #fcd34d 60%, #f59e0b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
            }}
          >
            {t('hallOfFame.title')}
          </Typography>
          <WorkspacePremiumIcon
            sx={{ color: 'rgba(245,158,11,0.7)', fontSize: 22 }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {books.length}{' '}
          {books.length === 1
            ? t('hallOfFame.favourite.singular')
            : t('hallOfFame.favourite.plural')}
        </Typography>
      </Box>

      <HallOfFameCarousel
        books={books}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <HallOfFameQuoteInput
        quote={quote || ''}
        editedQuote={editedQuote}
        setEditedQuote={setEditedQuote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleUpdate}
        disabled={!isOwnProfile}
      />
      <AnimatedAlert
        open={isUpdated}
        message="Quote updated successfully!"
        severity={ESeverity.SUCCESS}
        onClose={() => setIsUpdated(false)}
      />
      <AnimatedAlert
        open={isUpdateError}
        message="Failed to update quote. Please try again."
        severity={ESeverity.ERROR}
        onClose={() => setIsUpdateError(false)}
      />
    </MotionBox>
  );
}
