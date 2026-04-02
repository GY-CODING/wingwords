'use client';

import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Chip, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface BooksReadThisYearProps {
  booksReadThisYear: number;
  booksReadLastYear: number;
  fontFamily: string;
}

const BooksReadThisYear: React.FC<BooksReadThisYearProps> = ({
  booksReadThisYear,
  booksReadLastYear,
  fontFamily,
}) => {
  const { t } = useTranslation();
  const [displayCount, setDisplayCount] = useState(0);
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  useEffect(() => {
    if (booksReadThisYear === 0) {
      setDisplayCount(0);
      return;
    }
    const steps = 40;
    const stepDuration = 1500 / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplayCount(
        Math.min(
          Math.round((booksReadThisYear / steps) * step),
          booksReadThisYear
        )
      );
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, [booksReadThisYear]);

  const diff = booksReadThisYear - booksReadLastYear;
  const hasPrev = booksReadLastYear > 0;

  const TrendIcon =
    diff > 0 ? TrendingUpIcon : diff < 0 ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor =
    diff > 0 ? '#34d399' : diff < 0 ? '#f87171' : 'rgba(255,255,255,0.5)';
  const trendLabel =
    diff > 0
      ? t('stats.booksYear.trendUp', { diff, year: lastYear })
      : diff < 0
        ? t('stats.booksYear.trendDown', { diff, year: lastYear })
        : t('stats.booksYear.trendSame', { year: lastYear });

  const barData = [
    {
      label: String(lastYear),
      value: booksReadLastYear,
      color: 'rgba(147,51,234,0.4)',
    },
    { label: String(currentYear), value: booksReadThisYear, color: '#9333ea' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Big number */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            color: '#9333ea',
            fontFamily,
            fontSize: { xs: '3rem', sm: '4rem' },
            fontWeight: 'bold',
            lineHeight: 1,
          }}
        >
          {displayCount}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontFamily,
            fontSize: '1rem',
            mt: 0.5,
          }}
        >
          {t('stats.booksYear.read', { year: currentYear })}
        </Typography>
      </Box>

      {/* Trend badge */}
      {hasPrev && (
        <Chip
          icon={
            <TrendIcon
              sx={{ color: `${trendColor} !important`, fontSize: 18 }}
            />
          }
          label={trendLabel}
          size="small"
          sx={{
            background: `${trendColor}18`,
            border: `1px solid ${trendColor}50`,
            color: trendColor,
            fontFamily,
            fontSize: '0.78rem',
          }}
        />
      )}

      {/* Mini comparison bar chart */}
      <Box sx={{ width: '100%', height: 160, mt: 0.5 }}>
        <BarChart
          series={[
            {
              data: barData.map((d) => d.value),
              color: '#9333ea',
            },
          ]}
          xAxis={[
            {
              data: barData.map((d) => d.label),
              scaleType: 'band',
              colorMap: {
                type: 'ordinal',
                colors: barData.map((d) => d.color),
              },
            },
          ]}
          yAxis={[{ labelStyle: { fill: 'rgba(255,255,255,0.6)' } }]}
          height={150}
          sx={{
            '& .MuiChartsAxis-tickLabel': {
              fill: 'rgba(255,255,255,0.7)',
              fontFamily,
            },
            '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.1)' },
            '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.1)' },
            '& .MuiChartsLegend-root': { display: 'none' },
          }}
        />
      </Box>
    </Box>
  );
};

export default BooksReadThisYear;
