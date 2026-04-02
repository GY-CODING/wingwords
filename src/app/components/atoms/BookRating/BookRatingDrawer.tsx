'use client';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingProgressInput from './BookRatingProgressInput';
import BookRatingReviewInput from './BookRatingReviewInput';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import { BookRatingHandlers, BookRatingState } from './types';

interface Props {
  open: boolean;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingDrawer: React.FC<Props> = ({
  open,
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          maxHeight: '85vh',
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Drag indicator */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.15)',
            margin: '0 auto 16px',
          }}
        />

        {/* Header */}
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
              fontSize: 18,
              fontFamily,
            }}
          >
            {t('book.rating.title')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isBookSaved && handleDeleteBook && (
              <IconButton
                onClick={handleDeleteBook}
                size="small"
                sx={{
                  color: 'rgba(255, 100, 100, 0.7)',
                  background: 'rgba(255, 100, 100, 0.08)',
                  border: '1px solid rgba(255, 100, 100, 0.15)',
                }}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        <Stack spacing={3}>
          {/* Rating Section */}
          <Box>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
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

          {/* Status Section */}
          <Box>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
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

          {/* Dates Section */}
          <Box>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                fontWeight: 500,
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily,
              }}
            >
              {t('book.rating.section.readingPeriod')}
            </Typography>
            <Stack direction="row" gap={2}>
              <TextField
                type="date"
                value={state.tempStartDate}
                onChange={(e) => handlers.setTempStartDate(e.target.value)}
                label={t('book.rating.start')}
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
                    color: 'rgba(255, 255, 255, 0.6)',
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
                label={t('book.rating.end')}
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
                    color: 'rgba(255, 255, 255, 0.6)',
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

          {/* Apply Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handlers.handleApply}
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: 15,
              fontWeight: 600,
              fontFamily,
              background: 'rgba(255, 255, 255, 0.12)',
              boxShadow: 'none',
              '&:active': {
                transform: 'scale(0.98)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {t('book.rating.apply')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default BookRatingDrawer;
