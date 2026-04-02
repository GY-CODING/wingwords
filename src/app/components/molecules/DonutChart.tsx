'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

interface DonutChartProps {
  bookStatus?: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  READ: '#34d399', // green
  READING: '#60a5fa', // blue
  WANT_TO_READ: '#f59e0b', // amber
  DNF: '#f87171', // red
};
const FALLBACK_COLORS = ['#a855f7', '#c084fc', '#818cf8', '#e879f9'];

export default function DonutChart({ bookStatus }: DonutChartProps) {
  const { t } = useTranslation();
  // Guard clause: si no hay datos o está vacío
  if (!bookStatus || Object.keys(bookStatus).length === 0) {
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
          {t('stats.donut.noData')}
        </Typography>
      </Box>
    );
  }

  // Función para formatear los nombres de estados
  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case 'READ':
        return t('stats.status.read');
      case 'READING':
        return t('stats.status.reading');
      case 'WANT_TO_READ':
        return t('stats.status.wantToRead');
      default:
        return status;
    }
  };

  // Filtrar "unknown" y crear los datos formateados
  const statusKeys = Object.keys(bookStatus).filter(
    (status) => status !== 'unknown'
  );

  // Si después de filtrar no hay datos
  if (statusKeys.length === 0) {
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
          {t('stats.donut.noValidStatus')}
        </Typography>
      </Box>
    );
  }

  const data = statusKeys.map((status, idx) => ({
    label: formatStatusLabel(status),
    value: bookStatus[status],
    color:
      STATUS_COLORS[status] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    legend: {
      position: { vertical: 'bottom', horizontal: 'center' },
      color: 'white',
    },
  }));

  const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: false,
  };

  return (
    <PieChart
      sx={{
        width: ['300px', '500px'],
        height: ['250px', '300px'],
        '& .MuiPieChart-root': {
          backgroundColor: 'transparent',
        },
        '& .MuiChartsLegend-root': {
          '& .MuiChartsLegend-series text': {
            fill: 'rgba(255, 255, 255, 0.9) !important',
            fontWeight: '500',
            textShadow: 'none',
          },
        },
        '& .MuiPieChart-arc': {
          filter: 'none',
          stroke: 'rgba(255, 255, 255, 0.06)',
          strokeWidth: 1,
        },
        '& .MuiChartsTooltip-root': {
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
        },
      }}
      series={[
        {
          innerRadius: 50,
          outerRadius: 100,
          data,
          arcLabel: 'value',
        },
      ]}
      {...settings}
    />
  );
}
