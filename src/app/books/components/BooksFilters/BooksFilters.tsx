'use client';

import React from 'react';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import type {
  BooksFiltersState,
  BooksFilterOptions,
  BooksSeriesFilter,
  BooksSortBy,
} from '../../hooks/useBooksFilters';

interface BooksFiltersProps {
  filters: BooksFiltersState;
  filterOptions: BooksFilterOptions;
  activeFiltersCount: number;
  resultsCount: number;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: BooksSeriesFilter) => void;
  onSortByChange: (sort: BooksSortBy) => void;
  onReset: () => void;
}

const chipSx = (active: boolean) => ({
  fontFamily: lora.style.fontFamily,
  fontSize: '0.75rem',
  height: 30,
  cursor: 'pointer',
  borderRadius: '100px',
  border: active
    ? '1px solid rgba(147,51,234,0.6)'
    : '1px solid rgba(255,255,255,0.08)',
  background: active ? 'rgba(147,51,234,0.18)' : 'rgba(255,255,255,0.03)',
  color: active ? '#e9d5ff' : 'rgba(255,255,255,0.55)',
  transition: 'all 0.2s',
  '&:hover': {
    background: active ? 'rgba(147,51,234,0.28)' : 'rgba(255,255,255,0.07)',
    borderColor: active ? 'rgba(147,51,234,0.8)' : 'rgba(255,255,255,0.18)',
    color: active ? '#f3e8ff' : 'rgba(255,255,255,0.8)',
  },
});

const sectionLabelSx = {
  fontFamily: lora.style.fontFamily,
  fontSize: '0.68rem',
  color: 'rgba(255,255,255,0.3)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  mb: 0.75,
};

const SORT_OPTION_KEYS: Array<{ labelKey: string; value: BooksSortBy }> = [
  { labelKey: 'library.filters.sort.relevance', value: 'relevance' },
  { labelKey: 'library.filters.sort.ratingDesc', value: 'rating_desc' },
  { labelKey: 'library.filters.sort.titleAsc', value: 'title_asc' },
  { labelKey: 'library.filters.sort.titleDesc', value: 'title_desc' },
];

const SERIES_OPTION_KEYS: Array<{
  labelKey: string;
  value: BooksSeriesFilter;
}> = [
  { labelKey: 'library.filters.series.all', value: 'all' },
  { labelKey: 'library.filters.series.seriesOnly', value: 'series_only' },
  { labelKey: 'library.filters.series.standalone', value: 'standalone' },
];

export const BooksFilters: React.FC<BooksFiltersProps> = ({
  filters,
  filterOptions,
  activeFiltersCount,
  resultsCount,
  onAuthorChange,
  onSeriesChange,
  onSortByChange,
  onReset,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const hasFilters = activeFiltersCount > 0;
  const { t } = useTranslation();

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          px: { xs: 0.5, sm: 0 },
          py: 0.5,
          flexWrap: 'wrap',
        }}
      >
        {/* Results count */}
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.35)',
            fontFamily: lora.style.fontFamily,
            fontSize: '0.82rem',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            component="span"
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}
          >
            {resultsCount}
          </Box>{' '}
          {resultsCount !== 1
            ? t('library.filters.results.plural')
            : t('library.filters.results.singular')}
        </Typography>

        {/* Sort */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SortIcon sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 15 }} />
          <Select
            value={filters.sortBy}
            onChange={(e: SelectChangeEvent) =>
              onSortByChange(e.target.value as BooksSortBy)
            }
            variant="standard"
            disableUnderline
            sx={{
              color:
                filters.sortBy !== 'relevance'
                  ? '#e9d5ff'
                  : 'rgba(255,255,255,0.45)',
              fontFamily: lora.style.fontFamily,
              fontSize: '0.8rem',
              '& .MuiSelect-icon': {
                color: 'rgba(255,255,255,0.25)',
                fontSize: 18,
              },
              '& .MuiSelect-select': { pb: 0, pr: '22px !important' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#141420',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  '& .MuiMenuItem-root': {
                    fontFamily: lora.style.fontFamily,
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.65)',
                    borderRadius: '8px',
                    mx: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(147,51,234,0.15)',
                      color: '#e9d5ff',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(147,51,234,0.2)',
                      color: '#e9d5ff',
                    },
                  },
                },
              },
            }}
          >
            {SORT_OPTION_KEYS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: 'rgba(255,255,255,0.08)',
            height: 20,
            alignSelf: 'center',
          }}
        />

        {/* Active filters badge */}
        {hasFilters && (
          <Chip
            label={`${activeFiltersCount} ${activeFiltersCount > 1 ? t('library.filters.filter.plural') : t('library.filters.filter.singular')}`}
            onDelete={onReset}
            size="small"
            sx={{
              ...chipSx(true),
              height: 26,
              '& .MuiChip-deleteIcon': {
                color: '#a855f7',
                fontSize: '13px',
                '&:hover': { color: '#c084fc' },
              },
            }}
          />
        )}

        {/* Toggle filters button */}
        <Chip
          icon={
            expanded ? (
              <CloseIcon sx={{ fontSize: '15px !important' }} />
            ) : (
              <TuneIcon sx={{ fontSize: '15px !important' }} />
            )
          }
          label={
            expanded ? t('library.filters.hide') : t('library.filters.show')
          }
          onClick={() => setExpanded((v) => !v)}
          size="small"
          sx={{
            ...chipSx(expanded || hasFilters),
            height: 30,
            pl: 0.25,
            '& .MuiChip-icon': {
              color:
                expanded || hasFilters ? '#c084fc' : 'rgba(255,255,255,0.4)',
              ml: 0.5,
            },
          }}
        />
      </Box>

      {/* Expanded filter panel */}
      <Collapse in={expanded}>
        <Box
          sx={{
            mt: 1.5,
            p: { xs: 2, sm: 2.5 },
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            gap: { xs: 2.5, sm: 3 },
          }}
        >
          {/* Author */}
          {filterOptions.authorOptions.length > 0 && (
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={sectionLabelSx}>
                {t('library.filters.section.author')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                <Chip
                  label={t('library.filters.all')}
                  onClick={() => onAuthorChange('')}
                  sx={chipSx(filters.author === '')}
                />
                {filterOptions.authorOptions.map((author) => (
                  <Chip
                    key={author}
                    label={author}
                    onClick={() =>
                      onAuthorChange(filters.author === author ? '' : author)
                    }
                    sx={chipSx(filters.author === author)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Series */}
          <Box>
            <Typography sx={sectionLabelSx}>
              {t('library.filters.section.type')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {SERIES_OPTION_KEYS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={t(opt.labelKey)}
                  onClick={() => onSeriesChange(opt.value)}
                  sx={chipSx(filters.series === opt.value)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
