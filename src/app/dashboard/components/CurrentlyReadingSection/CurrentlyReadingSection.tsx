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
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

interface CurrentlyReadingSectionProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

const calculatePagesRead = (progress: number, totalPages: number): number => {
  if (progress <= 1) return Math.round(progress * totalPages);
  return progress;
};

const ReadingBookSkeleton = () => (
  <Box sx={{ mb: 3, p: { xs: 1, sm: 0 } }}>
    <Skeleton
      variant="text"
      width={150}
      height={32}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 2 }}
    />
    <Paper
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: { xs: 2, sm: 3 },
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: 90, sm: 100 },
            height: { xs: 135, sm: 150 },
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />
        <Box sx={{ flex: 1, width: '100%' }}>
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={8}
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
        </Box>
      </Box>
    </Paper>
  </Box>
);

export const CurrentlyReadingSection = React.memo<CurrentlyReadingSectionProps>(
  ({ books, isLoading }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (isLoading) return <ReadingBookSkeleton />;

    if (!books || books.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: { xs: 2, sm: 3 },
              border: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
            }}
          >
            <AutoStoriesIcon
              sx={{ fontSize: 64, color: 'rgba(147, 51, 234, 0.5)', mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 1,
                fontFamily: lora.style.fontFamily,
              }}
            >
              {t('dashboard.currentlyReading.empty')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: lora.style.fontFamily,
              }}
            >
              {t('dashboard.currentlyReading.emptyHint')}
            </Typography>
          </Box>
        </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3, p: { xs: 1, sm: 0 } }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: 'white',
                fontWeight: 700,
              }}
            >
              {t('dashboard.currentlyReading.title')}
            </Typography>
            {hasMultiple && (
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {currentIndex + 1} / {total}
              </Typography>
            )}
          </Box>

          <Paper
            sx={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Book content */}
            <Box
              onClick={() => router.push(`/books/${book.id}`)}
              sx={{
                padding: { xs: 2, sm: 3 },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.02)',
                },
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: { xs: 90, sm: 100 },
                        height: { xs: 135, sm: 150 },
                        flexShrink: 0,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <Image
                        src={displayData.coverUrl}
                        alt={displayData.title}
                        fill
                        sizes="(max-width: 600px) 90px, 100px"
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          mb: 0.5,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {displayData.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: lora.style.fontFamily,
                          mb: 2,
                        }}
                      >
                        {displayData.author}
                      </Typography>

                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 0.5,
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontFamily: lora.style.fontFamily,
                            }}
                          >
                            {Math.round(progressPercentage)}%{' '}
                            {t('dashboard.reading.completed')}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#9333ea',
                              fontWeight: 600,
                              fontFamily: lora.style.fontFamily,
                            }}
                          >
                            {pagesRead} / {displayData.pageCount}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(147, 51, 234, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background:
                                'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Carousel navigation */}
            {hasMultiple && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  px: 3,
                  pb: 2,
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  pt: 1.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    setCurrentIndex((i) => (i - 1 + total) % total)
                  }
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    p: 0.5,
                    '&:hover': {
                      color: '#c084fc',
                      background: 'rgba(147,51,234,0.1)',
                    },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>

                {/* Dot indicators */}
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {books.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      sx={{
                        width: i === currentIndex ? 16 : 6,
                        height: 6,
                        borderRadius: 3,
                        background:
                          i === currentIndex
                            ? 'linear-gradient(90deg, #9333ea, #c084fc)'
                            : 'rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        '&:hover': { background: 'rgba(192,132,252,0.5)' },
                      }}
                    />
                  ))}
                </Box>

                <IconButton
                  size="small"
                  onClick={() => setCurrentIndex((i) => (i + 1) % total)}
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    p: 0.5,
                    '&:hover': {
                      color: '#c084fc',
                      background: 'rgba(147,51,234,0.1)',
                    },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Box>
      </motion.div>
    );
  }
);

CurrentlyReadingSection.displayName = 'CurrentlyReadingSection';
