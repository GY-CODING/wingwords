'use client';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { EBookStatus } from '@gycoding/nebula';
import { Box, Button } from '@mui/material';
import React from 'react';
import { StatusOption, statusOptions } from './BookRatingOptions';

/** Semantic status color map for each book status */
const STATUS_COLORS: Record<EBookStatus, string> = {
  [EBookStatus.WANT_TO_READ]: '#fbbf24',
  [EBookStatus.READING]: '#818cf8',
  [EBookStatus.READ]: '#6ee7b7',
  [EBookStatus.DNF]: '#ef4444',
} as Record<EBookStatus, string>;

/** Returns the accent color for a given status, falling back to white */
function getStatusColor(status: EBookStatus): string {
  return STATUS_COLORS[status] ?? '#ffffff';
}

interface Props {
  tempStatus: EBookStatus;
  setTempStatus: (status: EBookStatus) => void;
  fontFamily: string;
}

const BookRatingStatusButtons: React.FC<Props> = ({
  tempStatus,
  setTempStatus,
  fontFamily,
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {statusOptions.map((opt: StatusOption) => {
        const isActive = tempStatus === opt.value;
        const color = getStatusColor(opt.value);

        return (
          <Button
            key={opt.value}
            variant={isActive ? 'contained' : 'outlined'}
            startIcon={React.cloneElement(opt.icon, {
              sx: {
                color: isActive ? '#fff' : `${color}80`,
                fontSize: 18,
              },
            })}
            onClick={() => setTempStatus(opt.value)}
            sx={{
              flex: '1 1 calc(50% - 6px)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: 13,
              minWidth: 'auto',
              color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
              background: isActive ? `${color}30` : 'rgba(255, 255, 255, 0.03)',
              borderColor: isActive
                ? `${color}60`
                : 'rgba(255, 255, 255, 0.08)',
              px: 1.5,
              py: 1,
              textTransform: 'none',
              fontFamily,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: isActive
                  ? `${color}40`
                  : 'rgba(255, 255, 255, 0.06)',
                borderColor: isActive
                  ? `${color}80`
                  : 'rgba(255, 255, 255, 0.12)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {t(opt.labelKey)}
          </Button>
        );
      })}
    </Box>
  );
};

export default BookRatingStatusButtons;
