'use client';

import { useTranslation } from '@/lib/i18n/I18nProvider';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';

export const TranslationBanner: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <Alert
        icon={<TranslateIcon fontSize="inherit" />}
        severity="info"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          borderRadius: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: 'rgba(255,255,255,0.85)',
          mb: 2,
          '& .MuiAlert-icon': { color: '#818cf8' },
          '& .MuiAlertTitle-root': { color: '#c7d2fe', fontWeight: 600 },
        }}
      >
        <AlertTitle>{t('translation.banner.title')}</AlertTitle>
        {t('translation.banner.message')}
      </Alert>
    </Collapse>
  );
};
