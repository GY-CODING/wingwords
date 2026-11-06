'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { getReadingProgress } from './utils/getReadingProgress';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

import { CountUp } from '../../motion/CountUp';
import { ProgressFill } from '../../motion/ProgressFill';
import { DURATION, EASE_OUT } from '../../motion/tokens';

const MotionBox = motion(Box);

/** Distancia (px) que hay que arrastrar para pasar de libro. */
const SWIPE = 48;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -16,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  }),
};

interface CurrentlyReadingMobileProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

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
    const [direction, setDirection] = useState<1 | -1>(1);
    const dragged = useRef(false);
    const hasNavigated = useRef(false);
    if (currentIndex !== 0 || direction !== 1) hasNavigated.current = true;

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

    const safeIndex = Math.min(currentIndex, books.length - 1);
    const book = books[safeIndex];
    const displayData = getBookDisplayData(book);
    if (!displayData) return null;

    const { pagesRead, progressPercentage, hasPageCount } = getReadingProgress(
      displayData.progress,
      displayData.pageCount
    );
    const total = books.length;
    const hasMultiple = total > 1;

    const go = (dir: 1 | -1) => {
      setDirection(dir);
      setCurrentIndex((i) => (i + dir + total) % total);
    };

    return (
      <Box
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <MotionBox
            key={book.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            // Deslizar para cambiar de libro
            drag={hasMultiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            dragSnapToOrigin
            onDragStart={() => {
              dragged.current = true;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE) go(1);
              else if (info.offset.x > SWIPE) go(-1);
              // El clic que sigue al arrastre no debe abrir el libro
              setTimeout(() => {
                dragged.current = false;
              }, 0);
            }}
            onClick={() => {
              if (!dragged.current) router.push(`/books/${book.id}`);
            }}
            sx={{
              touchAction: 'pan-y',
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
                    <CountUp
                      value={Math.round(progressPercentage)}
                      suffix="%"
                      animateOnMount={hasNavigated.current}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: '#c084fc',
                      fontWeight: 500,
                    }}
                  >
                    {hasPageCount ? (
                      <>
                        <CountUp
                          value={pagesRead}
                          animateOnMount={hasNavigated.current}
                        />
                        /{displayData.pageCount}
                      </>
                    ) : (
                      '-'
                    )}
                  </Typography>
                </Box>
                <ProgressFill
                  value={progressPercentage}
                  height={3}
                  trackColor="rgba(147, 51, 234, 0.12)"
                  label={t('dashboard.reading.completed')}
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
              aria-label={t('dashboard.currentlyReading.previous')}
              onClick={() => go(-1)}
              sx={{
                color: 'rgba(255,255,255,0.3)',
                p: 0.25,
                '&:hover': { color: '#c084fc' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {books.map((b, i) => (
                <Box
                  key={b.id ?? i}
                  component="button"
                  type="button"
                  aria-label={`${i + 1} / ${total}`}
                  aria-current={i === safeIndex}
                  onClick={() => {
                    if (i === safeIndex) return;
                    setDirection(i > safeIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  sx={{
                    position: 'relative',
                    width: i === safeIndex ? 12 : 5,
                    height: 5,
                    p: 0,
                    border: 0,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: `width ${DURATION.base}s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                >
                  {i === safeIndex && (
                    <motion.span
                      layoutId="ww-reading-dot-mobile"
                      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #9333ea, #c084fc)',
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
