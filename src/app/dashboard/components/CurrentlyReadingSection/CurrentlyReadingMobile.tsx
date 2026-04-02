'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

const MotionBox = motion(Box);

interface CurrentlyReadingMobileProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

const calculatePagesRead = (progress: number, totalPages: number): number => {
  if (progress <= 1) return Math.round(progress * totalPages);
  return progress;
};

const CurrentlyReadingMobileSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      gap: 1.5,
      p: 1.5,
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    }}
  >
    <Skeleton
      variant="rectangular"
      width={52}
      height={78}
      sx={{
        borderRadius: '8px',
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        flexShrink: 0,
      }}
    />
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0.5,
      }}
    >
      <Skeleton
        variant="text"
        width="70%"
        height={18}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
      <Skeleton
        variant="text"
        width="45%"
        height={14}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
      <Skeleton
        variant="rectangular"
        height={4}
        sx={{ borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.04)', mt: 0.5 }}
      />
    </Box>
  </Box>
);

export const CurrentlyReadingMobile = React.memo<CurrentlyReadingMobileProps>(
  ({ books, isLoading }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (isLoading) return <CurrentlyReadingMobileSkeleton />;

    if (!books || books.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <AutoStoriesIcon
            sx={{ fontSize: 28, color: 'rgba(147, 51, 234, 0.4)' }}
          />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {t('dashboard.currentlyReading.emptyMobile')}
          </Typography>
        </Box>
      );
    }

    const book = books[currentIndex];
    const displayData = getBookDisplayData(book);
    if (!displayData) return null;

    const pagesRead = calculatePagesRead(
      displayData.progress,
      displayData.pageCount
    );
    const progressPercentage =
      displayData.pageCount > 0 ? (pagesRead / displayData.pageCount) * 100 : 0;
    const total = books.length;
    const hasMultiple = total > 1;

    return (
      <Box
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={book.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onClick={() => router.push(`/books/${book.id}`)}
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 1.5,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              '&:active': { background: 'rgba(147, 51, 234, 0.06)' },
            }}
          >
            {/* Cover */}
            <Box
              sx={{
                position: 'relative',
                width: 52,
                height: 78,
                flexShrink: 0,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Image
                src={displayData.coverUrl}
                alt={displayData.title}
                fill
                sizes="52px"
                style={{ objectFit: 'cover' }}
              />
            </Box>

            {/* Info */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
                gap: 0.25,
              }}
            >
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayData.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayData.author}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.35)',
                    }}
                  >
                    {Math.round(progressPercentage)}%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: '#c084fc',
                      fontWeight: 500,
                    }}
                  >
                    {pagesRead}/{displayData.pageCount}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: 'rgba(147, 51, 234, 0.12)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background:
                        'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
                    },
                  }}
                />
              </Box>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Navigation bar — solo si hay más de 1 */}
        {hasMultiple && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              px: 2,
              pb: 1.5,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setCurrentIndex((i) => (i - 1 + total) % total)}
              sx={{
                color: 'rgba(255,255,255,0.3)',
                p: 0.25,
                '&:hover': { color: '#c084fc' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {books.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  sx={{
                    width: i === currentIndex ? 12 : 5,
                    height: 5,
                    borderRadius: 3,
                    background:
                      i === currentIndex
                        ? 'linear-gradient(90deg, #9333ea, #c084fc)'
                        : 'rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </Box>

            <IconButton
              size="small"
              onClick={() => setCurrentIndex((i) => (i + 1) % total)}
              sx={{
                color: 'rgba(255,255,255,0.3)',
                p: 0.25,
                '&:hover': { color: '#c084fc' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }
);

CurrentlyReadingMobile.displayName = 'CurrentlyReadingMobile';
