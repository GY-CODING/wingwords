/* eslint-disable @typescript-eslint/no-explicit-any */

import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  Badge,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BooksViewToggle, ViewType } from '../BooksViewToggle/BooksViewToggle';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { ActiveFiltersChips } from './ActiveFiltersChips';
import { BooksFilterMobileDrawer } from './BooksFilterMobileDrawer';

const MotionIconButton = motion(IconButton);

const statusChipColors: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  [EBookStatus.READING]: {
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.15)',
    border: 'rgba(129,140,248,0.4)',
  },
  [EBookStatus.READ]: {
    color: '#6ee7b7',
    bg: 'rgba(110,231,183,0.15)',
    border: 'rgba(110,231,183,0.4)',
  },
  [EBookStatus.WANT_TO_READ]: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.15)',
    border: 'rgba(251,191,36,0.4)',
  },
  [EBookStatus.RATE]: {
    color: '#6ee7b7',
    bg: 'rgba(110,231,183,0.15)',
    border: 'rgba(110,231,183,0.4)',
  },
  NOT_FINISHED: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.15)',
    border: 'rgba(248,113,113,0.4)',
  },
};

const FILTER_LABEL_SX = {
  fontFamily: lora.style.fontFamily,
  fontSize: 13,
  color: 'rgba(255, 255, 255, 0.5)',
  mb: 1,
} as const;

// Icono de cada estado en las fichas del filtro (como en la app)
const STATUS_ICONS: Record<string, typeof BookmarkBorderIcon> = {
  [EBookStatus.WANT_TO_READ]: BookmarkBorderIcon,
  [EBookStatus.READING]: MenuBookOutlinedIcon,
  [EBookStatus.READ]: CheckCircleOutlineIcon,
  [EBookStatus.RATE]: StarRoundedIcon,
  NOT_FINISHED: HighlightOffIcon,
  DNF: HighlightOffIcon,
};

const MENU_PROPS = {
  PaperProps: {
    sx: {
      background: 'rgba(8, 4, 18, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '12px',
      mt: 0.5,
      '& .MuiMenuItem-root': {
        fontFamily: 'inherit',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.85rem',
        '&:hover': {
          background: 'rgba(168, 85, 247, 0.12)',
          color: '#fff',
        },
        '&.Mui-selected': {
          background: 'rgba(147, 51, 234, 0.2)',
          color: '#c084fc',
          '&:hover': { background: 'rgba(147, 51, 234, 0.28)' },
        },
      },
    },
  },
};

interface CompactBooksFilterProps {
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

export const CompactBooksFilter: React.FC<CompactBooksFilterProps> = ({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Opciones de ordenamiento
  const orderOptions = [
    { label: t('profile.filter.order.original'), value: '' },
    { label: t('profile.filter.author'), value: 'author' },
    { label: t('profile.filter.rating'), value: 'rating' },
    { label: t('profile.filter.series'), value: 'series' },
    { label: t('profile.filter.order.title'), value: 'title' },
  ];

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
    ratingFilter &&
      ratingFilter > 0 && {
        type: 'rating',
        label: t('profile.filter.active.rating', { stars: ratingFilter }),
        value: ratingFilter,
      },
    search && {
      type: 'search',
      label: `"${search}"`,
      value: search,
    },
  ].filter(Boolean);

  const activeFiltersCount = activeFilters.length;

  const handleOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOrderMenuAnchor(event.currentTarget);
  };

  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  const handleOrderChange = (value: string) => {
    onOrderByChange(value);
    handleOrderMenuClose();
  };

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

  const handleClearAll = () => {
    onStatusChange(null);
    onAuthorChange('');
    onSeriesChange('');
    onRatingChange(0);
    onSearchChange('');
  };

  const renderSelect = (
    value: any,
    onChange: (v: any) => void,
    options: any[],
    placeholder: string
  ) => {
    const isActive = Boolean(value);
    return (
      <FormControl sx={{ minWidth: 100, flex: 1 }}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          MenuProps={MENU_PROPS}
          sx={{
            color: '#fff',
            fontWeight: 500,
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
            background: isActive
              ? 'rgba(147, 51, 234, 0.1)'
              : 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            border: isActive
              ? '1px solid rgba(168, 85, 247, 0.35)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            boxShadow: 'none',
            minHeight: 32,
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
            '& .MuiSvgIcon-root': {
              color: isActive ? '#a855f7' : 'rgba(255, 255, 255, 0.5)',
              fontSize: 18,
            },
            '&:hover': {
              border: isActive
                ? '1px solid rgba(168, 85, 247, 0.55)'
                : '1px solid rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <MenuItem
            value=""
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontWeight: 500,
              fontSize: 13,
              fontFamily: lora.style.fontFamily,
            }}
          >
            {placeholder}
          </MenuItem>
          {options.map((opt: any) => (
            <MenuItem
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              sx={{ fontFamily: lora.style.fontFamily, fontSize: 13 }}
            >
              {opt.label ?? opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderOrderButton = () => (
    <Tooltip title={t('profile.filter.sort')} arrow>
      <MotionIconButton
        onClick={handleOrderMenuOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          background: orderBy
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(255, 255, 255, ${orderBy ? '0.12' : '0.08'})`,
          color: 'rgba(255, 255, 255, 0.7)',
          width: 32,
          height: 32,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        <SortIcon sx={{ fontSize: 16 }} />
      </MotionIconButton>
    </Tooltip>
  );

  // Mobile version - solo botón que abre drawer
  if (isMobile) {
    return (
      <>
        {/* Botón de filtros */}
        <Tooltip title={t('profile.filter.title')} arrow>
          <Badge badgeContent={activeFiltersCount} color="secondary">
            <MotionIconButton
              onClick={() => setMobileDrawerOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.7)',
                width: 36,
                height: 36,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <FilterListIcon sx={{ fontSize: 18 }} />
            </MotionIconButton>
          </Badge>
        </Tooltip>

        {/* Mobile Drawer con todo (view toggle + filtros + orden) */}
        <BooksFilterMobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
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
          isOwnProfile={isOwnProfile}
        />
      </>
    );
  }

  // Desktop version - view toggle + botón, filtros se expanden hacia ABAJO
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Línea superior: View Toggle + Botón de Filtros */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* View Toggle */}
        {onViewChange && view !== undefined && (
          <BooksViewToggle
            view={view}
            onViewChange={onViewChange}
            isOwnProfile={isOwnProfile}
          />
        )}

        {/* Botón de expandir/colapsar filtros */}
        <Tooltip
          title={
            filtersExpanded
              ? t('library.filters.hide')
              : t('profile.filter.title')
          }
          arrow
        >
          <MotionIconButton
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              background: filtersExpanded
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(255, 255, 255, ${filtersExpanded ? '0.12' : '0.08'})`,
              color: 'rgba(255, 255, 255, 0.7)',
              width: 32,
              height: 32,
              position: 'relative',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <Badge
              badgeContent={activeFiltersCount}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  right: 2,
                  top: 2,
                  fontSize: 9,
                  height: 14,
                  minWidth: 14,
                  padding: '0 4px',
                },
              }}
            >
              {filtersExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 16 }} />
              ) : (
                <FilterAltIcon
                  sx={{
                    fontSize: 16,
                    color: activeFiltersCount > 0 ? '#a855f7' : undefined,
                  }}
                />
              )}
            </Badge>
          </MotionIconButton>
        </Tooltip>
      </Box>

      {/* Panel de filtros expandido */}
      <AnimatePresence>
        {filtersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: 460,
              maxWidth: 'calc(100vw - 32px)',
              zIndex: 1000,
              overflow: 'hidden',
              marginTop: 8,
            }}
          >
            <Box
              sx={{
                p: 2.5,
                background: 'rgba(22, 20, 28, 0.97)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                boxShadow: '0 24px 48px -16px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.25,
              }}
            >
              {/* Search */}
              <TextField
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('profile.filter.search')}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '14px',
                    color: '#fff',
                    height: 44,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.35)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(168, 85, 247, 0.55)',
                      borderWidth: 1,
                    },
                    '& input': {
                      fontFamily: lora.style.fontFamily,
                      fontSize: 14,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 16 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Estado: fichas con icono, como en la hoja de filtros de la app */}
              <Box>
                <Typography sx={FILTER_LABEL_SX}>
                  {t('profile.filter.status')}
                </Typography>
                <Box
                  role="radiogroup"
                  aria-label={t('profile.filter.status')}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${statusOptions.length}, minmax(0, 1fr))`,
                    gap: 1,
                  }}
                >
                  {statusOptions.map((opt) => {
                    const isSelected = statusFilter === opt.value;
                    const c = statusChipColors[opt.value] ?? {
                      color: '#c084fc',
                      bg: 'rgba(192,132,252,0.15)',
                      border: 'rgba(192,132,252,0.4)',
                    };
                    const Icon = STATUS_ICONS[opt.value] ?? CircleOutlinedIcon;
                    return (
                      <Box
                        key={opt.value}
                        component="button"
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() =>
                          onStatusChange(isSelected ? null : opt.value)
                        }
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minHeight: 64,
                          px: 0.5,
                          borderRadius: '14px',
                          cursor: 'pointer',
                          fontFamily: lora.style.fontFamily,
                          fontSize: 12.5,
                          lineHeight: 1.2,
                          textAlign: 'center',
                          color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                          background: isSelected
                            ? c.color
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: isSelected
                            ? `0 8px 18px -10px ${c.color}`
                            : 'none',
                          transition:
                            'background-color 0.2s, border-color 0.2s, color 0.2s',
                          '&:hover': {
                            borderColor: isSelected ? 'transparent' : c.border,
                            color: isSelected ? '#fff' : c.color,
                          },
                          '&:focus-visible': {
                            outline: `2px solid ${c.border}`,
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <Icon sx={{ fontSize: 20 }} />
                        {opt.label}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Valoración mínima: píldoras, "Todos" en morado relleno */}
              <Box>
                <Typography sx={FILTER_LABEL_SX}>
                  {t('profile.filter.rating')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {[0, 1, 2, 3, 4, 5].map((star) => {
                    const active = (ratingFilter || 0) === star;
                    return (
                      <Box
                        key={star}
                        component="button"
                        type="button"
                        aria-pressed={active}
                        onClick={() => onRatingChange(star)}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.4,
                          height: 34,
                          px: 1.5,
                          borderRadius: 999,
                          cursor: 'pointer',
                          fontFamily: lora.style.fontFamily,
                          fontSize: 13,
                          fontWeight: active ? 700 : 400,
                          color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                          background: active
                            ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                          transition: 'background-color 0.2s, color 0.2s',
                          '&:hover': { color: '#fff' },
                        }}
                      >
                        {star === 0 ? (
                          t('profile.filter.all')
                        ) : (
                          <>
                            <StarRoundedIcon
                              sx={{
                                fontSize: 15,
                                color: active ? '#fff' : '#fbbf24',
                              }}
                            />
                            {star}
                            {star < 5 ? '+' : ''}
                          </>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Active non-status filters */}
              {activeFilters.filter((f: any) => f.type !== 'status').length >
                0 && (
                <ActiveFiltersChips
                  activeFilters={
                    activeFilters.filter((f: any) => f.type !== 'status') as any
                  }
                  onRemove={handleRemoveFilter}
                  onClearAll={handleClearAll}
                />
              )}

              {/* Secondary filters: author / series / rating / sort */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  '& .MuiFormControl-root': { width: '100%', minWidth: 0 },
                }}
              >
                <Box>
                  <Typography sx={FILTER_LABEL_SX}>
                    {t('profile.filter.author')}
                  </Typography>
                  {renderSelect(
                    authorFilter,
                    onAuthorChange,
                    authorOptions,
                    t('profile.filter.author')
                  )}
                </Box>
                <Box>
                  <Typography sx={FILTER_LABEL_SX}>
                    {t('profile.filter.series')}
                  </Typography>
                  {renderSelect(
                    seriesFilter,
                    onSeriesChange,
                    seriesOptions,
                    t('profile.filter.series')
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ ...FILTER_LABEL_SX, mb: 0, mr: 'auto' }}>
                  {t('profile.filter.orderBy')}
                </Typography>
                {renderOrderButton()}
                {orderBy && (
                  <Tooltip
                    title={`Sort ${
                      orderDirection === 'asc' ? 'Ascending' : 'Descending'
                    }`}
                    arrow
                  >
                    <MotionIconButton
                      onClick={() =>
                        onOrderDirectionChange(
                          orderDirection === 'asc' ? 'desc' : 'asc'
                        )
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      {orderDirection === 'asc' ? (
                        <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                      )}
                    </MotionIconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu de ordenamiento */}
      <Menu
        anchorEl={orderMenuAnchor}
        open={Boolean(orderMenuAnchor)}
        onClose={handleOrderMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(8, 4, 18, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            mt: 1,
          },
        }}
      >
        {orderOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleOrderChange(option.value)}
            selected={orderBy === option.value}
            sx={{
              color:
                orderBy === option.value
                  ? '#c084fc'
                  : 'rgba(255, 255, 255, 0.6)',
              fontSize: 13,
              fontFamily: lora.style.fontFamily,
              '&.Mui-selected': {
                background: 'rgba(147, 51, 234, 0.2)',
              },
              '&:hover': {
                background: 'rgba(168, 85, 247, 0.12)',
                color: '#fff',
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
