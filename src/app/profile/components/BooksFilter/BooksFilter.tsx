/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { BooksFilterMobileDrawer } from './BooksFilterMobileDrawer';
import { ActiveFiltersChips } from './ActiveFiltersChips';
import { BooksViewToggle, ViewType } from '../BooksViewToggle/BooksViewToggle';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Select,
  MenuItem,
  Box,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  Menu,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AnimatePresence, motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';

interface BooksFilterProps {
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

export const BooksFilter: React.FC<BooksFilterProps> = ({
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
  // Opciones de ordenamiento
  const orderOptions = [
    { label: t('profile.filter.order.original'), value: '' },
    { label: t('profile.filter.author'), value: 'author' },
    { label: t('profile.filter.rating'), value: 'rating' },
    { label: t('profile.filter.series'), value: 'series' },
    { label: t('profile.filter.order.title'), value: 'title' },
  ];
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Active filters calculation
  const activeFilters = [
    statusFilter && {
      type: 'status',
      label: t('profile.filter.active.status', {
        value: statusOptions.find((o) => o.value === statusFilter)?.label,
      }),
      value: statusFilter,
    },
    authorFilter && {
      type: 'author',
      label: t('profile.filter.active.author', { author: authorFilter }),
      value: authorFilter,
    },
    seriesFilter && {
      type: 'series',
      label: t('profile.filter.active.series', { series: seriesFilter }),
      value: seriesFilter,
    },
    ratingFilter > 0 && {
      type: 'rating',
      label: t('profile.filter.active.rating', { stars: ratingFilter }),
      value: ratingFilter,
    },
    search && { type: 'search', label: `"${search}"`, value: search },
  ].filter(Boolean);

  // Count active filters
  const activeFiltersCount = [
    statusFilter,
    authorFilter !== '',
    seriesFilter !== '',
    ratingFilter > 0,
    search !== '',
  ].filter(Boolean).length;

  // Handle remove individual filter
  const handleRemoveFilter = (type: string) => {
    switch (type) {
      case 'status':
        onStatusChange(null);
        break;
      case 'author':
        onAuthorChange('');
        break;
      case 'series':
        onSeriesChange('');
        break;
      case 'rating':
        onRatingChange(0);
        break;
      case 'search':
        onSearchChange('');
        break;
    }
  };

  // Handle clear all filters
  const handleClearAll = () => {
    onStatusChange(null);
    onAuthorChange('');
    onSeriesChange('');
    onRatingChange(0);
    onSearchChange('');
  };
  // Mobile Drawer state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Render helpers
  const renderOrderButton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
      <Button
        variant="outlined"
        size="small"
        sx={{
          minWidth: 55,
          height: 55,
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
        onClick={(e) => setOrderMenuAnchor(e.currentTarget)}
      >
        <FilterListIcon sx={{ fontSize: 24, color: 'white' }} />
      </Button>
      <Menu
        anchorEl={orderMenuAnchor}
        open={Boolean(orderMenuAnchor)}
        onClose={() => setOrderMenuAnchor(null)}
      >
        {orderOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={orderBy === opt.value}
            onClick={() => {
              onOrderByChange(opt.value);
              setOrderMenuAnchor(null);
            }}
            sx={{ fontFamily: lora.style.fontFamily }}
          >
            {opt.label}
          </MenuItem>
        ))}
        <MenuItem divider />
        <MenuItem
          onClick={() => {
            onOrderDirectionChange(orderDirection === 'asc' ? 'desc' : 'asc');
            setOrderMenuAnchor(null);
          }}
          sx={{ fontFamily: lora.style.fontFamily }}
        >
          {orderDirection === 'asc' ? 'Asc' : 'Desc'}{' '}
          {orderDirection === 'asc' ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )}
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderSelect = (
    value: any,
    onChange: (v: any) => void,
    options: any[],
    placeholder: string
  ) => (
    <FormControl sx={{ minWidth: 110, flex: 1 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          {placeholder}
        </MenuItem>
        {options.map((opt: any) => (
          <MenuItem
            key={opt.value ?? opt}
            value={opt.value ?? opt}
            sx={{ color: '#fff', fontWeight: 500 }}
          >
            <span style={{ fontFamily: lora.style.fontFamily }}>
              {opt.label ?? opt}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Rating options
  const ratingOptions = [
    { label: t('profile.filter.all'), value: 0 },
    ...[1, 2, 3, 4, 5].map((star) => ({
      label: `${'★'.repeat(star)} ${star}${star < 5 ? '+' : ''}`,
      value: star,
    })),
  ];

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1201 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 0,
                width: 56,
                height: 56,
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <FilterListIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Button>
          </Box>
        )}
        {/* El botón flotante desaparece cuando el drawer está abierto */}
        <BooksFilterMobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          authorOptions={authorOptions}
          seriesOptions={seriesOptions}
          authorFilter={authorFilter}
          seriesFilter={seriesFilter}
          ratingFilter={ratingFilter}
          search={search}
          onStatusChange={onStatusChange}
          onAuthorChange={onAuthorChange}
          onSeriesChange={onSeriesChange}
          onRatingChange={onRatingChange}
          onSearchChange={onSearchChange}
          orderBy={orderBy}
          orderDirection={orderDirection}
          onOrderByChange={onOrderByChange}
          onOrderDirectionChange={onOrderDirectionChange}
          view={view}
          onViewChange={onViewChange}
        />
      </>
    );
  }
  // Desktop view
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        px: { xs: 0.5, sm: 1, md: 2 },
        mb: 2,
        maxWidth: { xs: '100%', md: 1200 },
        mx: 'auto',
      }}
    >
      {/* Collapsible Filters Toggle Button + BooksViewToggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: filtersExpanded ? 2 : 0,
        }}
      >
        {/* Botón de collapse filtros */}
        <Box
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            px: 2,
            py: 1.5,
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
            <Box
              component="span"
              sx={{
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontWeight: 600,
              }}
            >
              {t('profile.filter.title')}{' '}
              {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Box>
          </Box>
          {filtersExpanded ? (
            <ExpandLessIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          ) : (
            <ExpandMoreIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          )}
        </Box>

        {/* BooksViewToggle aquí - solo si view y onViewChange están presentes */}
        {onViewChange && view !== undefined && (
          <BooksViewToggle
            view={view}
            onViewChange={onViewChange}
            isOwnProfile={isOwnProfile}
          />
        )}
      </Box>

      {/* Animated Collapsible Content */}
      <AnimatePresence initial={false}>
        {filtersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Box
              sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* Search Bar - Full Width */}
              <TextField
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('profile.filter.search')}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
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

              {/* Active Filters Chips */}
              {activeFilters.length > 0 && (
                <ActiveFiltersChips
                  activeFilters={activeFilters}
                  onRemove={handleRemoveFilter}
                  onClearAll={handleClearAll}
                />
              )}

              {/* Filter Controls - Inline */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {renderSelect(
                  ratingFilter,
                  onRatingChange,
                  ratingOptions,
                  t('profile.filter.rating')
                )}
                {renderSelect(
                  statusFilter ?? '',
                  onStatusChange,
                  statusOptions,
                  t('profile.filter.status')
                )}
                {renderSelect(
                  authorFilter,
                  onAuthorChange,
                  authorOptions,
                  t('profile.filter.author')
                )}
                {renderSelect(
                  seriesFilter,
                  onSeriesChange,
                  seriesOptions,
                  t('profile.filter.series')
                )}
                {renderOrderButton()}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
