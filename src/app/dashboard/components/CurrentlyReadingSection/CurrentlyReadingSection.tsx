'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { getReadingProgress } from './utils/getReadingProgress';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { CountUp } from '../../motion/CountUp';
import { ProgressFill } from '../../motion/ProgressFill';
import { DURATION, EASE_OUT } from '../../motion/tokens';

/** El libro entra desde el lado hacia el que se navega y sale por el contrario. */
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -20,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  }),
};

const navButtonSx = {
  color: 'rgba(255,255,255,0.45)',
  p: 0.5,
  transition: `color ${DURATION.fast}s, background-color ${DURATION.fast}s, transform ${DURATION.fast}s`,
  '&:hover': {
    color: '#c084fc',
    background: 'rgba(147,51,234,0.1)',
  },
  '&:active': { transform: 'scale(0.92)' },
} as const;

interface CurrentlyReadingSectionProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

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
    const [direction, setDirection] = useState<1 | -1>(1);
    const hasNavigated = useRef(false);
    if (currentIndex !== 0 || direction !== 1) hasNavigated.current = true;

    if (isLoading) return <ReadingBookSkeleton />;

    if (!books || books.length === 0) {
      return (
        <div>
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
        </div>
      );
    }

    const total = books.length;
    const safeIndex = Math.min(currentIndex, total - 1);
    const book = books[safeIndex];
    const displayData = getBookDisplayData(book);
    if (!displayData) return null;

    const { pagesRead, progressPercentage, hasPageCount } = getReadingProgress(
      displayData.progress,
      displayData.pageCount
    );
    const hasMultiple = total > 1;

    const go = (dir: 1 | -1) => {
      setDirection(dir);
      setCurrentIndex((i) => (i + dir + total) % total);
    };
    const goTo = (i: number) => {
      if (i === safeIndex) return;
      setDirection(i > safeIndex ? 1 : -1);
      setCurrentIndex(i);
    };

    // Tras la entrada de la columna; al cambiar de libro, casi inmediato.

    return (
      <div>
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
                aria-live="polite"
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.45)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {safeIndex + 1} / {total}
              </Typography>
            )}
          </Box>

          <Paper
            onKeyDown={(e) => {
              if (!hasMultiple) return;
              if (e.key === 'ArrowRight') go(1);
              if (e.key === 'ArrowLeft') go(-1);
            }}
            sx={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
              position: 'relative',
              transition: `border-color ${DURATION.base}s`,
              '&:hover': { borderColor: 'rgba(147, 51, 234, 0.22)' },
            }}
          >
            {/* Book content */}
            <Box
              role="link"
              tabIndex={0}
              aria-label={`${displayData.title} · ${displayData.author}`}
              onClick={() => router.push(`/books/${book.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') router.push(`/books/${book.id}`);
              }}
              sx={{
                padding: { xs: 2, sm: 3 },
                cursor: 'pointer',
                outline: 'none',
                transition: `background-color ${DURATION.base}s`,
                '&:hover': { background: 'rgba(255, 255, 255, 0.02)' },
                '&:focus-visible': {
                  boxShadow: 'inset 0 0 0 2px rgba(192, 132, 252, 0.6)',
                  borderRadius: '20px',
                },
                // La portada se abre un poco, como un libro, al pasar el ratón
                '&:hover .ww-cover': {
                  transform:
                    'perspective(700px) rotateY(-14deg) translateX(-2px)',
                  boxShadow: '14px 12px 32px rgba(0, 0, 0, 0.55)',
                },
                '&:hover .ww-cover-sheen': { opacity: 1 },
              }}
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={book.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Box
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                  >
                    {/* Portada: se revela de abajo arriba al llegar */}
                    <motion.div
                      initial={
                        hasNavigated.current
                          ? {
                              clipPath: 'inset(100% 0% 0% 0% round 8px)',
                              scale: 1.04,
                            }
                          : false
                      }
                      animate={{
                        clipPath: 'inset(0% 0% 0% 0% round 8px)',
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: EASE_OUT,
                        delay: 0.05,
                      }}
                      style={{ flexShrink: 0 }}
                    >
                      <Box
                        className="ww-cover"
                        sx={{
                          position: 'relative',
                          width: { xs: 90, sm: 100 },
                          height: { xs: 135, sm: 150 },
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          transformOrigin: 'left center',
                          transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
                          '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none',
                            transform: 'none !important',
                          },
                        }}
                      >
                        <Image
                          src={displayData.coverUrl}
                          alt={displayData.title}
                          fill
                          sizes="(max-width: 600px) 90px, 100px"
                          style={{ objectFit: 'cover' }}
                        />
                        {/* Lomo y reflejo del papel */}
                        <Box
                          aria-hidden
                          className="ww-cover-sheen"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.12) 6%, transparent 14%, transparent 70%, rgba(255,255,255,0.08) 100%)',
                            opacity: 0.6,
                            transition: `opacity ${DURATION.slow}s`,
                            pointerEvents: 'none',
                          }}
                        />
                      </Box>
                    </motion.div>

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
                          textWrap: 'balance',
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
                            mb: 0.75,
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.55)',
                              fontFamily: lora.style.fontFamily,
                            }}
                          >
                            <CountUp
                              value={Math.round(progressPercentage)}
                              suffix="%"
                              animateOnMount={hasNavigated.current}
                            />{' '}
                            {t('dashboard.reading.completed')}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#c084fc',
                              fontWeight: 600,
                              fontFamily: lora.style.fontFamily,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {hasPageCount ? (
                              <>
                                <CountUp
                                  value={pagesRead}
                                  animateOnMount={hasNavigated.current}
                                />{' '}
                                / {displayData.pageCount}
                              </>
                            ) : (
                              '-'
                            )}
                          </Typography>
                        </Box>
                        <ProgressFill
                          value={progressPercentage}
                          label={t('dashboard.reading.completed')}
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
                  aria-label={t('dashboard.currentlyReading.previous')}
                  onClick={() => go(-1)}
                  sx={navButtonSx}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>

                {/* Indicadores: la píldora activa viaja entre puntos */}
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  {books.map((b, i) => (
                    <Box
                      key={b.id ?? i}
                      component="button"
                      type="button"
                      aria-label={`${i + 1} / ${total}`}
                      aria-current={i === safeIndex}
                      onClick={() => goTo(i)}
                      sx={{
                        position: 'relative',
                        width: i === safeIndex ? 16 : 6,
                        height: 6,
                        p: 0,
                        border: 0,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        transition: `width ${DURATION.base}s cubic-bezier(0.16, 1, 0.3, 1), background-color ${DURATION.fast}s`,
                        '&:hover': { background: 'rgba(192,132,252,0.5)' },
                        '&:focus-visible': {
                          outline: '2px solid rgba(192,132,252,0.7)',
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {i === safeIndex && (
                        <motion.span
                          layoutId="ww-reading-dot"
                          transition={{
                            duration: DURATION.slow,
                            ease: EASE_OUT,
                          }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 3,
                            background:
                              'linear-gradient(90deg, #9333ea, #c084fc)',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                <IconButton
                  size="small"
                  aria-label={t('dashboard.currentlyReading.next')}
                  onClick={() => go(1)}
                  sx={navButtonSx}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Box>
      </div>
    );
  }
);

CurrentlyReadingSection.displayName = 'CurrentlyReadingSection';
