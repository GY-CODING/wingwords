'use client';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Box, Chip, Typography } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface MonthlyActivitySparklineProps {
  monthlyBooksRead: number[];
  booksReadThisYear: number;
  fontFamily: string;
}

function computeCurrentStreak(data: number[], currentMonth: number): number {
  let streak = 0;
  for (let i = currentMonth; i >= 0; i--) {
    if (data[i] > 0) streak++;
    else break;
  }
  return streak;
}

const MonthlyActivitySparkline: React.FC<MonthlyActivitySparklineProps> = ({
  monthlyBooksRead,
  booksReadThisYear,
  fontFamily,
}) => {
  const { t, locale } = useTranslation();
  // Build localised short month names (Jan/Ene etc.) for display text
  const localizedMonths = Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleString(locale, { month: 'short' })
  );
  const currentMonth = new Date().getMonth();
  const activeData = monthlyBooksRead.slice(0, currentMonth + 1);
  const peakValue = activeData.length > 0 ? Math.max(...activeData) : 0;
  const peakMonthIndex = peakValue > 0 ? activeData.indexOf(peakValue) : -1;
  const streak = computeCurrentStreak(monthlyBooksRead, currentMonth);

  if (booksReadThisYear === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          gap: 2,
        }}
      >
        <CalendarMonthIcon
          sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 40 }}
        />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontFamily,
            fontSize: 15,
            textAlign: 'center',
            px: 2,
          }}
        >
          {t('stats.monthly.noData')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 2,
        px: 1,
      }}
    >
      {/* Stats row */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#a855f7',
              fontFamily,
              fontSize: '2.2rem',
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            {booksReadThisYear}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily,
              fontSize: '0.75rem',
            }}
          >
            {t('stats.monthly.booksThisYear')}
          </Typography>
        </Box>

        {peakValue > 0 && peakMonthIndex >= 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#60a5fa',
                fontFamily,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {peakValue}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily,
                fontSize: '0.75rem',
              }}
            >
              {t('stats.monthly.bestIn', {
                month: localizedMonths[peakMonthIndex],
              })}
            </Typography>
          </Box>
        )}

        {streak > 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#f59e0b',
                fontFamily,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {streak}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily,
                fontSize: '0.75rem',
              }}
            >
              {t('stats.monthly.streak')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sparkline bar chart */}
      <Box sx={{ width: '100%' }}>
        <SparkLineChart
          data={monthlyBooksRead}
          height={110}
          plotType="line"
          showTooltip
          showHighlight
          color="#9333ea"
          valueFormatter={(v) => `${v} book${v !== 1 ? 's' : ''}`}
          xAxis={{
            scaleType: 'band',
            data: MONTHS,
          }}
        />
      </Box>

      {/* Month axis labels */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          px: 0.5,
          mt: -1.5,
        }}
      >
        {MONTHS.map((m, i) => (
          <Typography
            key={m}
            sx={{
              color:
                i === peakMonthIndex && peakValue > 0
                  ? '#a855f7'
                  : i > currentMonth
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.4)',
              fontFamily,
              fontSize: '0.62rem',
              fontWeight:
                i === peakMonthIndex && peakValue > 0 ? 'bold' : 'normal',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {m.charAt(0)}
          </Typography>
        ))}
      </Box>

      {/* Badges */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {peakValue > 0 && peakMonthIndex >= 0 && (
          <Chip
            icon={<AutoStoriesIcon sx={{ fontSize: 12 }} />}
            label={t('stats.monthly.peakChip', {
              month: localizedMonths[peakMonthIndex],
              count: peakValue,
            })}
            size="small"
            sx={{
              backgroundColor: 'rgba(168,85,247,0.12)',
              color: '#a855f7',
              border: '1px solid rgba(168,85,247,0.25)',
              fontFamily,
              fontSize: '0.72rem',
              '& .MuiChip-icon': { color: '#a855f7' },
            }}
          />
        )}
        {streak > 1 && (
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: 12 }} />}
            label={t('stats.monthly.streakChip', { count: streak })}
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.12)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.25)',
              fontFamily,
              fontSize: '0.72rem',
              '& .MuiChip-icon': { color: '#f59e0b' },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MonthlyActivitySparkline;
