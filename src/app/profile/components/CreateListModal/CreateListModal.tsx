'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateListModalProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description?: string }) => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: lora.style.fontFamily,
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#a855f7' },
    },
    '& .MuiInputLabel-root': {
      fontFamily: lora.style.fontFamily,
      color: 'rgba(255,255,255,0.4)',
      '&.Mui-focused': { color: '#a855f7' },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(18,10,30,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
          fontFamily: lora.style.fontFamily,
          color: '#fff',
        }}
      >
        <FormatListBulletedIcon sx={{ color: '#a855f7', fontSize: 22 }} />
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: 18,
            flex: 1,
          }}
        >
          {t('lists.modal.title')}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label={t('lists.modal.name.label')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 100 }}
            sx={inputSx}
          />
          <TextField
            label={t('lists.modal.description.label')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 500 }}
            sx={inputSx}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim() || isSubmitting}
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              textTransform: 'none',
              borderRadius: '10px',
              py: 1.2,
              '&:hover': {
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {isSubmitting ? t('lists.modal.creating') : t('lists.modal.create')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
