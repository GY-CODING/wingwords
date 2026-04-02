'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { lora } from '@/utils/fonts/fonts';

interface RatingStatsProps {
  ratings: {
    distribution: Record<string, number>;
    averageRating: number;
    totalRatedBooks: number;
  };
  fontFamily: string;
}

// All levels 0, 0.5, 1, 1.5 ... 5
const RATING_LEVELS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
// Only whole numbers shown as x-axis labels
const WHOLE_LABELS = RATING_LEVELS.map((l) =>
  Number.isInteger(l) ? String(l) : ''
);

const RatingStats: React.FC<RatingStatsProps> = ({ ratings, fontFamily }) => {
  const { t } = useTranslation();
  // Guard clause
  if (!ratings || ratings.totalRatedBooks === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: lora.style.fontFamily,
            fontSize: 16,
          }}
        >
          {t('stats.rating.noData')}
        </Typography>
      </Box>
    );
  }

  const data = RATING_LEVELS.map(
    (l) => ratings.distribution[l.toString()] || 0
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: 2,
      }}
    >
      {/* Average rating header */}
      <Box sx={{ textAlign: 'center', mb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Star sx={{ color: '#9333ea', fontSize: '24px' }} />
          <Typography
            sx={{
              color: '#9333ea',
              fontFamily: lora.style.fontFamily,
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            {ratings.averageRating.toFixed(1)}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: '1.1rem',
          }}
        >
          {t('stats.rating.average', { count: ratings.totalRatedBooks })}
        </Typography>
      </Box>

      {/* Sparkline */}
      <Box sx={{ width: '100%' }}>
        <SparkLineChart
          data={data}
          height={120}
          plotType="line"
          showTooltip
          showHighlight
          area
          color="#9333ea"
          valueFormatter={(v) => `${v} book${v !== 1 ? 's' : ''}`}
          xAxis={{
            scaleType: 'band',
            data: RATING_LEVELS,
          }}
        />
      </Box>

      {/* X-axis labels: only whole numbers */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          px: 0.5,
          mt: -1.5,
        }}
      >
        {WHOLE_LABELS.map((label, i) => (
          <Typography
            key={i}
            sx={{
              color: label ? 'rgba(255,255,255,0.5)' : 'transparent',
              fontFamily,
              fontSize: '0.65rem',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {label || '·'}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default RatingStats;
