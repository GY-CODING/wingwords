'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Box, Typography } from '@mui/material';
import { RadarChart } from '@mui/x-charts/RadarChart';
import React from 'react';

interface ReadingRadarProps {
  readingCompletionRate: number;
  reviewedBooks: number;
  ratedBooks: number;
  uniqueAuthors: number;
  seriesTracked: number;
  booksReadThisYear: number;
  readCount: number;
  fontFamily: string;
}

interface MetricDisplay {
  label: string;
  score: number;
  color: string;
  tooltip: string;
}

const METRIC_COLORS = [
  '#a855f7',
  '#60a5fa',
  '#34d399',
  '#f59e0b',
  '#f472b6',
  '#818cf8',
];

function buildMetrics(
  props: ReadingRadarProps,
  t: (id: string) => string
): MetricDisplay[] {
  const safe = Math.max(props.readCount, 1);

  return [
    {
      label: t('stats.radar.completionist'),
      score: Math.round(props.readingCompletionRate),
      color: METRIC_COLORS[0],
      tooltip: t('stats.radar.tooltip.completionist'),
    },
    {
      label: t('stats.radar.critic'),
      score: Math.min(Math.round((props.reviewedBooks / safe) * 100), 100),
      color: METRIC_COLORS[1],
      tooltip: t('stats.radar.tooltip.critic'),
    },
    {
      label: t('stats.radar.rater'),
      score: Math.min(Math.round((props.ratedBooks / safe) * 100), 100),
      color: METRIC_COLORS[2],
      tooltip: t('stats.radar.tooltip.rater'),
    },
    {
      label: t('stats.radar.diverse'),
      score: Math.min(Math.round((props.uniqueAuthors / safe) * 100), 100),
      color: METRIC_COLORS[3],
      tooltip: t('stats.radar.tooltip.diverse'),
    },
    {
      label: t('stats.radar.seriesFan'),
      score: Math.min(props.seriesTracked * 5, 100),
      color: METRIC_COLORS[4],
      tooltip: t('stats.radar.tooltip.seriesFan'),
    },
    {
      label: t('stats.radar.active'),
      score: Math.min(Math.round((props.booksReadThisYear / 20) * 100), 100),
      color: METRIC_COLORS[5],
      tooltip: t('stats.radar.tooltip.active'),
    },
  ];
}

const ReadingRadar: React.FC<ReadingRadarProps> = (props) => {
  const { t } = useTranslation();
  const { readCount, booksReadThisYear, fontFamily } = props;
  const hasData = readCount > 0 || booksReadThisYear > 0;

  if (!hasData) {
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
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontFamily,
            fontSize: 15,
            textAlign: 'center',
            px: 2,
          }}
        >
          {t('stats.radar.noData')}
        </Typography>
      </Box>
    );
  }

  const metrics = buildMetrics(props, t);
  const radarData = metrics.map((m) => m.score);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 1.5,
      }}
    >
      {/* Radar chart */}
      <RadarChart
        series={[
          {
            data: radarData,
            label: '',
            fillArea: true,
            color: '#9333ea',
            valueFormatter: (value, { dataIndex }) =>
              metrics[dataIndex]?.tooltip ?? `${value}%`,
          },
        ]}
        radar={{
          metrics: metrics.map((m) => m.label),
          max: 100,
          startAngle: -30,
        }}
        hideLegend
        width={300}
        height={260}
        sx={{
          '& .MuiChartsAxis-tickLabel': {
            fill: 'rgba(255,255,255,0.65)',
            fontSize: '11px',
            fontFamily,
          },
          '& .MuiRadarGrid-line': {
            stroke: 'rgba(255,255,255,0.08)',
          },
          '& .MuiRadarSeriesPlot-area': {
            opacity: 0.25,
          },
          '& .MuiRadarSeriesPlot-line': {
            strokeWidth: 2,
          },
          '& .MuiRadarAxis-line': {
            stroke: 'rgba(255,255,255,0.1)',
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(1)': {
            fill: METRIC_COLORS[0],
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(2)': {
            fill: METRIC_COLORS[1],
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(3)': {
            fill: METRIC_COLORS[2],
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(4)': {
            fill: METRIC_COLORS[3],
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(5)': {
            fill: METRIC_COLORS[4],
          },
          '& .MuiRadarSeriesPlot-mark:nth-of-type(6)': {
            fill: METRIC_COLORS[5],
          },
        }}
      />

      {/* Score pills */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          justifyContent: 'center',
          px: 1,
        }}
      >
        {metrics.map((m) => (
          <Box
            key={m.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: `${m.color}18`,
              border: `1px solid ${m.color}33`,
              borderRadius: '20px',
              px: 1.25,
              py: 0.35,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: m.color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                color: m.color,
                fontFamily,
                fontSize: '0.7rem',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {m.label}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily,
                fontSize: '0.7rem',
                lineHeight: 1.3,
              }}
            >
              {m.score}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReadingRadar;
