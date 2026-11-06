import { useTranslation } from '@/hooks/useTranslation';
import { UserProfileBook } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface BooksStatsDisplayProps {
  books: UserProfileBook[];
  compact?: boolean;
}

export const BooksStatsDisplay: React.FC<BooksStatsDisplayProps> = ({
  books,
  compact = false,
}) => {
  const { t } = useTranslation();
  const readCount = books.filter(
    (b) => b.userData?.status === EBookStatus.READ
  ).length;
  const readingCount = books.filter(
    (b) => b.userData?.status === EBookStatus.READING
  ).length;
  const wantToReadCount = books.filter(
    (b) => b.userData?.status === EBookStatus.WANT_TO_READ
  ).length;
  // El backend guarda el DNF como NOT_FINISHED (ver rateBook.ts)
  const dnfCount = books.filter((b) =>
    ['NOT_FINISHED', 'DNF'].includes(b.userData?.status as string)
  ).length;

  if (compact) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircleIcon sx={{ fontSize: 14, color: '#6ee7b7' }} />
          <Typography
            sx={{
              color: '#6ee7b7',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {readCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MenuBookIcon sx={{ fontSize: 14, color: '#818cf8' }} />
          <Typography
            sx={{
              color: '#818cf8',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {readingCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BookmarkIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
          <Typography
            sx={{
              color: '#fbbf24',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {wantToReadCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CancelIcon sx={{ fontSize: 14, color: '#f87171' }} />
          <Typography
            sx={{
              color: '#f87171',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {dnfCount}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        flexWrap: 'wrap',
        mt: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CheckCircleIcon sx={{ fontSize: 16, color: '#6ee7b7' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('profile.stats.read')}:
        </Typography>
        <Typography
          sx={{
            color: '#6ee7b7',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {readCount}
        </Typography>
      </Box>

      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <MenuBookIcon sx={{ fontSize: 16, color: '#818cf8' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('profile.stats.reading')}:
        </Typography>
        <Typography
          sx={{
            color: '#818cf8',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {readingCount}
        </Typography>
      </Box>

      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <BookmarkIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('profile.stats.wantToRead')}:
        </Typography>
        <Typography
          sx={{
            color: '#fbbf24',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {wantToReadCount}
        </Typography>
      </Box>

      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CancelIcon sx={{ fontSize: 16, color: '#f87171' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('book.rating.status.notFinished')}:
        </Typography>
        <Typography
          sx={{
            color: '#f87171',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {dnfCount}
        </Typography>
      </Box>
    </Box>
  );
};
