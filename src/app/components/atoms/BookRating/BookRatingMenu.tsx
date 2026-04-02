'use client';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  Menu,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingProgressInput from './BookRatingProgressInput';
import BookRatingReviewInput from './BookRatingReviewInput';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import { BookRatingHandlers, BookRatingState } from './types';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingMenu: React.FC<Props> = ({
  open,
  anchorEl,
  onClose,
  state,
  handlers,
  isBookSaved,
  isLoading,
  isSubmitting,
  fontFamily = 'inherit',
  handleDeleteBook,
}) => {
  const { t } = useTranslation();
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      TransitionProps={{
        timeout: 250,
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minWidth: { xs: 'calc(100vw - 32px)', sm: 500, md: 600 },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 600, md: 720 },
          background: 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        {/* Header con título y botón eliminar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: 20,
              fontFamily,
            }}
          >
            {t('book.rating.title')}
          </Typography>
          {isBookSaved && handleDeleteBook && (
            <IconButton
              onClick={handleDeleteBook}
              size="small"
              sx={{
                color: 'rgba(255, 100, 100, 0.7)',
                background: 'rgba(255, 100, 100, 0.08)',
                border: '1px solid rgba(255, 100, 100, 0.15)',
                '&:hover': {
                  background: 'rgba(255, 100, 100, 0.12)',
                  borderColor: 'rgba(255, 100, 100, 0.2)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {/* Layout en 2 columnas (stack en mobile) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
          }}
        >
          {/* Columna izquierda: Rating y Review */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 13,
                fontWeight: 500,
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily,
              }}
            >
              {t('book.rating.section.rating')}
            </Typography>
            <RatingStars
              rating={state.tempRating}
              onRatingChange={handlers.setTempRating}
              disabled={isLoading || isSubmitting}
              isLoading={isLoading}
            />
            <Box sx={{ mt: 2 }}>
              <BookRatingReviewInput
                tempReview={state.tempReview}
                setTempReview={handlers.setTempReview}
                fontFamily={fontFamily}
                isLoading={isLoading || isSubmitting}
              />
            </Box>
          </Box>

          {/* Columna derecha: Status y Progress */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 13,
                fontWeight: 500,
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily,
              }}
            >
              {t('book.rating.section.status')}
            </Typography>
            <BookRatingStatusButtons
              tempStatus={state.tempStatus}
              setTempStatus={handlers.setTempStatus}
              fontFamily={fontFamily}
            />
            <Box sx={{ mt: 2 }}>
              <BookRatingProgressInput
                tempProgress={state.tempProgress}
                setTempProgress={handlers.setTempProgress}
                isProgressPercent={state.isProgressPercent}
                setIsProgressPercent={handlers.setIsProgressPercent}
                fontFamily={fontFamily}
              />
            </Box>
          </Box>
        </Box>

        {/* Fechas en una fila */}
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
              fontWeight: 500,
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily,
            }}
          >
            {t('book.rating.section.readingPeriod')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              type="date"
              value={state.tempStartDate}
              onChange={(e) => handlers.setTempStartDate(e.target.value)}
              label={t('book.rating.startDate')}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 14,
                  fontFamily,
                },
                input: {
                  color: '#fff',
                  fontSize: 14,
                  fontFamily,
                },
              }}
            />
            <TextField
              type="date"
              value={state.tempEndDate}
              onChange={(e) => handlers.setTempEndDate(e.target.value)}
              label={t('book.rating.endDate')}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 14,
                  fontFamily,
                },
                input: {
                  color: '#fff',
                  fontSize: 14,
                  fontFamily,
                },
              }}
            />
          </Stack>
        </Box>

        {/* Botón Apply */}
        <Button
          variant="contained"
          fullWidth
          onClick={handlers.handleApply}
          disabled={isSubmitting}
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 600,
            fontFamily,
            background: 'rgba(255, 255, 255, 0.12)',
            boxShadow: 'none',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.18)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {t('book.rating.apply')}
        </Button>
      </Box>
    </Menu>
  );
};

export default BookRatingMenu;
