import { useTranslation } from '@/hooks/useTranslation';
import { UserProfileBook } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
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
    </Box>
  );
};
