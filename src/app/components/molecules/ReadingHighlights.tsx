'use client';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ReadingHighlightsProps {
  readingCompletionRate: number;
  reviewedBooks: number;
  seriesTracked: number;
  longestBook: { title: string; pages: number } | null;
  totalBooks: number;
  fontFamily: string;
}

interface AnimatedRingProps {
  value: number;
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

const AnimatedRing: React.FC<AnimatedRingProps> = ({
  value,
  size = 120,
  color = '#9333ea',
  children,
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const steps = 60;
      const stepDuration = 1500 / steps;
      const interval = setInterval(() => {
        start++;
        setProgress(Math.min(Math.round((value / steps) * start), value));
        if (start >= steps) clearInterval(interval);
      }, stepDuration);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        {/* Value ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.05s ease-out' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const ReadingHighlights: React.FC<ReadingHighlightsProps> = ({
  readingCompletionRate,
  reviewedBooks,
  seriesTracked,
  longestBook,
  totalBooks,
  fontFamily,
}) => {
  const { t } = useTranslation();
  const reviewRate =
    totalBooks > 0 ? Math.round((reviewedBooks / totalBooks) * 100) : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
        gap: 1,
      }}
    >
      {/* Top row: two animated rings */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, sm: 5 },
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Completion rate */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <AnimatedRing value={readingCompletionRate} color="#9333ea">
            <WorkspacePremiumIcon
              sx={{ color: '#9333ea', fontSize: 20, mb: 0.25 }}
            />
            <Typography
              sx={{
                color: '#9333ea',
                fontFamily,
                fontSize: '1.1rem',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {readingCompletionRate}%
            </Typography>
          </AnimatedRing>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontFamily,
              fontSize: '0.72rem',
              textAlign: 'center',
              maxWidth: 90,
            }}
          >
            {t('stats.highlights.completionRate')}
          </Typography>
        </Box>

        {/* Review rate */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <AnimatedRing value={reviewRate} color="#60a5fa">
            <RateReviewIcon sx={{ color: '#60a5fa', fontSize: 20, mb: 0.25 }} />
            <Typography
              sx={{
                color: '#60a5fa',
                fontFamily,
                fontSize: '1.1rem',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {reviewRate}%
            </Typography>
          </AnimatedRing>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontFamily,
              fontSize: '0.72rem',
              textAlign: 'center',
              maxWidth: 90,
            }}
          >
            {t('stats.highlights.booksReviewed')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: '80%', borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Bottom row: series + longest book */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 4 },
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {/* Series tracked */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            background: 'rgba(147,51,234,0.08)',
            border: '1px solid rgba(147,51,234,0.2)',
            borderRadius: '14px',
            px: 2.5,
            py: 1.5,
            minWidth: 90,
          }}
        >
          <MenuBookIcon sx={{ color: '#a855f7', fontSize: 22 }} />
          <Typography
            sx={{
              color: '#a855f7',
              fontFamily,
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {seriesTracked}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily,
              fontSize: '0.72rem',
            }}
          >
            {t('stats.highlights.series')}
          </Typography>
        </Box>

        {/* Longest book */}
        {longestBook && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              background: 'rgba(96,165,250,0.08)',
              border: '1px solid rgba(96,165,250,0.2)',
              borderRadius: '14px',
              px: 2.5,
              py: 1.5,
              maxWidth: 160,
            }}
          >
            <AutoStoriesIcon sx={{ color: '#60a5fa', fontSize: 22 }} />
            <Typography
              sx={{
                color: '#60a5fa',
                fontFamily,
                fontSize: '1.1rem',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {longestBook.pages.toLocaleString()}p
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily,
                fontSize: '0.68rem',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {longestBook.title}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReadingHighlights;
