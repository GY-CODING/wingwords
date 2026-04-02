'use client';

import { useTranslation } from '@/lib/i18n/I18nProvider';
import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from '@/lib/i18n/locales';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Menu, MenuItem } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';
import React, { useState } from 'react';

/**
 * Dropdown para seleccionar el idioma.
 * Persiste la preferencia en localStorage automáticamente.
 *
 * Uso: <LocaleSwitcher />
 */
export const LocaleSwitcher = () => {
  const { locale, setLocale } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.6,
          px: 1.2,
          py: 0.7,
          borderRadius: '10px',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          backgroundColor: open
            ? 'rgba(147, 51, 234, 0.18)'
            : 'rgba(147, 51, 234, 0.08)',
          color: 'rgba(255, 255, 255, 0.85)',
          cursor: 'pointer',
          minWidth: '72px',
          transition: 'all 0.2s ease',
          userSelect: 'none',
          '&:hover': {
            borderColor: '#a855f7',
            backgroundColor: 'rgba(147, 51, 234, 0.18)',
            color: 'white',
          },
        }}
      >
        <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>
          {LOCALE_FLAGS[locale as Locale]}
        </Box>
        <Box
          component="span"
          sx={{
            fontSize: '0.75rem',
            fontFamily: lora.style.fontFamily,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {locale}
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: '0.9rem',
            color: 'rgba(192,132,252,0.7)',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            ml: 'auto',
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: '6px',
              background: 'rgba(12, 12, 16, 0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(147, 51, 234, 0.15)',
              borderRadius: '12px',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(147,51,234,0.12)',
              minWidth: '140px',
              overflow: 'hidden',
              color: 'white',
            },
          },
        }}
      >
        {SUPPORTED_LOCALES.map((loc) => (
          <MenuItem
            key={loc}
            onClick={() => handleSelect(loc)}
            selected={loc === locale}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1,
              fontFamily: lora.style.fontFamily,
              fontSize: '13px',
              color: loc === locale ? '#c084fc' : 'rgba(255,255,255,0.75)',
              borderRadius: '8px',
              mx: '4px',
              my: '2px',
              transition: 'background 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                color: 'white',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(147, 51, 234, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(147, 51, 234, 0.18)',
                },
              },
            }}
          >
            <Box component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
              {LOCALE_FLAGS[loc]}
            </Box>
            <Box component="span">{LOCALE_LABELS[loc]}</Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
