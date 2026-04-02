import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import { BooksViewToggle, ViewType } from '../BooksViewToggle/BooksViewToggle';

interface BooksFilterMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  statusOptions: { label: string; value: EBookStatus }[];
  statusFilter: EBookStatus | null;
  authorOptions: string[];
  seriesOptions: string[];
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  onStatusChange: (status: EBookStatus | null) => void;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: string) => void;
  onRatingChange: (rating: number) => void;
  onSearchChange: (search: string) => void;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  onOrderByChange: (orderBy: string) => void;
  onOrderDirectionChange: (direction: 'asc' | 'desc') => void;
  view?: ViewType;
  onViewChange?: (view: ViewType) => void;
  isOwnProfile?: boolean;
}

export const BooksFilterMobileDrawer: React.FC<
  BooksFilterMobileDrawerProps
> = ({
  open,
  onClose,
  statusOptions,
  statusFilter,
  authorOptions,
  seriesOptions,
  authorFilter,
  seriesFilter,
  ratingFilter,
  search,
  onStatusChange,
  onAuthorChange,
  onSeriesChange,
  onRatingChange,
  onSearchChange,
  orderBy,
  orderDirection,
  onOrderByChange,
  onOrderDirectionChange,
  view,
  onViewChange,
  isOwnProfile = true,
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
  const orderOptions = [
    { label: t('profile.filter.author'), value: 'author' },
    { label: t('profile.filter.rating'), value: 'rating' },
    { label: t('profile.filter.series'), value: 'series' },
    { label: t('profile.filter.order.title'), value: 'title' },
  ];
  const ratingOptions = [
    { label: t('profile.filter.all'), value: 0 },
    ...[1, 2, 3, 4, 5].map((star) => ({
      label: `${'★'.repeat(star)} ${star}${star < 5 ? '+' : ''}`,
      value: star,
    })),
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          pb: 2,
          background: 'rgba(10, 10, 15, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minHeight: 380,
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        {/* Botón X para cerrar el drawer */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            },
          }}
          aria-label="Close filters"
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              mb: 0.5,
              fontSize: 20,
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.05rem',
            }}
          >
            {t('profile.filter.title')}
          </Typography>

          {/* BooksViewToggle - solo si view y onViewChange están presentes */}
          {onViewChange && view !== undefined && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <BooksViewToggle
                view={view}
                onViewChange={onViewChange}
                isOwnProfile={isOwnProfile}
              />
            </Box>
          )}
          <TextField
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('profile.filter.search')}
            variant="outlined"
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              minWidth: 110,
              input: {
                color: '#fff',
                fontFamily: lora.style.fontFamily,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={ratingFilter}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {ratingOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt.label}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={statusFilter ?? ''}
              onChange={(e) => onStatusChange(e.target.value as EBookStatus)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {t('profile.filter.status')}
              </MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt.label}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={authorFilter}
              onChange={(e) => onAuthorChange(e.target.value)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {t('profile.filter.author')}
              </MenuItem>
              {authorOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={seriesFilter}
              onChange={(e) => onSeriesChange(e.target.value)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {t('profile.filter.series')}
              </MenuItem>
              {seriesOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: lora.style.fontFamily,
              }}
            >
              {t('profile.filter.orderBy')}
            </Typography>
            <FormControl sx={{ minWidth: 110 }}>
              <Select
                value={orderBy}
                onChange={(e) => onOrderByChange(e.target.value)}
                displayEmpty
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 15,
                  fontFamily: lora.style.fontFamily,
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  minHeight: 40,
                  '.MuiOutlinedInput-notchedOutline': { border: 0 },
                  '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' },
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                {orderOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ color: '#fff', fontWeight: 500 }}
                  >
                    <span style={{ fontFamily: lora.style.fontFamily }}>
                      {opt.label}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() =>
                onOrderDirectionChange(
                  orderDirection === 'asc' ? 'desc' : 'asc'
                )
              }
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '10px',
                px: 0,
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: lora.style.fontFamily,
                fontWeight: 500,
                fontSize: 15,
                boxShadow: 'none',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {orderDirection === 'asc' ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};
