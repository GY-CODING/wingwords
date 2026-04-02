'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

const MAX_LENGTH = 300;

interface BiographySectionProps {
  biography: string;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (bio: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
  compact?: boolean;
}

export const BiographySection: React.FC<BiographySectionProps> = ({
  biography,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  onEdit,
  canEdit = true,
  compact = false,
}) => {
  const isEditActive = canEdit && isEditing;
  const canStartEdit = canEdit && !!onEdit;
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: compact ? '100%' : { xs: '100%', sm: 340, md: 400 },
      }}
    >
      <AnimatePresence mode="wait">
        {isEditActive ? (
          <MotionBox
            key="editing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <TextField
              autoFocus
              multiline
              minRows={compact ? 2 : 3}
              maxRows={8}
              value={biography}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('profile.biography.placeholder')}
              fullWidth
              inputProps={{ maxLength: MAX_LENGTH }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onCancel();
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  if (!isLoading) onSave();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: '1px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.18)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.28)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: lora.style.fontFamily,
                  fontStyle: 'italic',
                  fontSize: compact ? 12 : 13,
                  lineHeight: 1.75,
                },
                '& textarea::placeholder': {
                  color: 'rgba(255,255,255,0.2)',
                  fontStyle: 'italic',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'flex-end',
              }}
            >
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '11px',
                  color:
                    biography.length > MAX_LENGTH - 30
                      ? 'rgba(255,255,255,0.6)'
                      : 'rgba(255,255,255,0.18)',
                  transition: 'color 0.2s',
                  mr: 'auto',
                }}
              >
                {biography.length}/{MAX_LENGTH}
              </Typography>
              <Tooltip
                title={t('profile.biography.cancelTooltip')}
                placement="top"
              >
                <IconButton
                  onClick={onCancel}
                  disabled={isLoading}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    p: 0.5,
                    '&:hover': {
                      color: 'rgba(255,255,255,0.65)',
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t('profile.biography.saveTooltip')}
                placement="top"
              >
                <IconButton
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!isLoading) onSave();
                  }}
                  disabled={isLoading}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    p: 0.5,
                    background: 'rgba(255,255,255,0.05)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.22)',
                      color: 'rgba(255,255,255,0.95)',
                    },
                  }}
                >
                  <CheckIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </MotionBox>
        ) : (
          <MotionBox
            key="display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onClick={canStartEdit ? onEdit : undefined}
            sx={{
              cursor: canStartEdit ? 'pointer' : 'default',
              px: compact ? 1.25 : 2,
              py: compact ? 1 : 1.25,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.22s ease',
              '&:hover': canStartEdit
                ? {
                    background: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.11)',
                  }
                : {},
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: biography
                  ? 'rgba(255,255,255,0.72)'
                  : 'rgba(255,255,255,0.28)',
                fontFamily: lora.style.fontFamily,
                fontStyle: 'italic',
                fontSize: compact ? { xs: 12, md: 13 } : 14,
                lineHeight: 1.75,
                display: compact ? '-webkit-box' : 'block',
                overflow: compact ? 'hidden' : 'visible',
                textOverflow: compact ? 'ellipsis' : 'clip',
                WebkitLineClamp: compact ? 2 : 'unset',
                WebkitBoxOrient: compact ? 'vertical' : 'unset',
              }}
            >
              {biography ||
                (canEdit ? 'Add a biography…' : 'No biography yet.')}
            </Typography>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
