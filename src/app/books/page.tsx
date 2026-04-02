'use client';

import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { Box, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { BooksEmptyState } from './components/BooksEmptyState/BooksEmptyState';
import { BooksFilters } from './components/BooksFilters/BooksFilters';
import { BooksGrid } from './components/BooksGrid/BooksGrid';
import { BooksSearchBar } from './components/BooksSearchBar/BooksSearchBar';
import { AuthorCard } from './components/AuthorCard/AuthorCard';
import { useBooksFilters } from './hooks/useBooksFilters';
import { SearchMode, useBooksSearch } from './hooks/useBooksSearch';

const MotionBox = motion(Box);

const HERO_GLOW_SX = {
  position: 'absolute' as const,
  borderRadius: '50%',
  filter: 'blur(80px)',
  pointerEvents: 'none',
};

function BooksHero({
  query,
  onQueryChange,
  searchMode,
  onSearchModeChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
}) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 7, md: 10 },
        pb: { xs: 3, sm: 5, md: 9 },
        gap: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Eyebrow label */}
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: '100px',
          border: '1px solid rgba(147,51,234,0.3)',
          background: 'rgba(147,51,234,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: '#c084fc',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {t('library.hero.eyebrow')}
        </Typography>
      </MotionBox>

      {/* Main title */}
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ textAlign: 'center', px: 2 }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '2.8rem', sm: '4.5rem', md: '6rem', lg: '7.5rem' },
            lineHeight: 1,
            fontWeight: 700,
            background:
              'linear-gradient(135deg, #ffffff 20%, #c084fc 60%, #818cf8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            paddingBottom: 2,
          }}
        >
          {t('library.hero.title')}
        </Typography>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            color: 'rgba(255,255,255,0.4)',
            mt: { xs: 0.5, md: 1 },
            letterSpacing: '0.02em',
          }}
        >
          {t('library.hero.subtitle')}
        </Typography>
      </MotionBox>

      {/* Search bar */}
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ width: '100%', mt: { xs: 1, sm: 2 } }}
      >
        <BooksSearchBar
          value={query}
          onChange={onQueryChange}
          placeholder={
            searchMode === 'books'
              ? t('library.search.placeholder.books')
              : t('library.search.placeholder.authors')
          }
        />
      </MotionBox>

      {/* Mode toggle */}
      <MotionBox
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            p: '3px',
          }}
        >
          {(['books', 'authors'] as const).map((mode) => (
            <Box
              key={mode}
              onClick={() => onSearchModeChange(mode)}
              sx={{
                position: 'relative',
                px: { xs: 2, sm: 2.5 },
                py: 0.875,
                borderRadius: '100px',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {searchMode === mode && (
                <motion.div
                  layoutId="search-mode-indicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '100px',
                    background: 'rgba(147,51,234,0.18)',
                    border: '1px solid rgba(147,51,234,0.35)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  fontWeight: searchMode === mode ? 700 : 400,
                  color:
                    searchMode === mode ? '#c084fc' : 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.25s',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {mode === 'books'
                  ? t('library.search.mode.books')
                  : t('library.search.mode.authors')}
              </Typography>
            </Box>
          ))}
        </Box>
      </MotionBox>
    </Box>
  );
}

function BooksContent() {
  const {
    query,
    setQuery,
    books,
    authors,
    searchMode,
    setSearchMode,
    isLoading,
    hasSearched,
  } = useBooksSearch();
  const {
    filters,
    filteredBooks,
    filterOptions,
    activeFiltersCount,
    setAuthor,
    setSeries,
    setSortBy,
    resetFilters,
  } = useBooksFilters(books);

  const showBooksGrid =
    searchMode === 'books' && (isLoading || filteredBooks.length > 0);
  const showBooksEmpty =
    searchMode === 'books' &&
    !isLoading &&
    hasSearched &&
    filteredBooks.length === 0;
  const showAuthorsEmpty =
    searchMode === 'authors' &&
    !isLoading &&
    hasSearched &&
    authors.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      {/* Background glows */}
      <Box
        sx={{
          ...HERO_GLOW_SX,
          top: '0%',
          left: '10%',
          width: 600,
          height: 500,
          background:
            'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          ...HERO_GLOW_SX,
          top: '5%',
          right: '5%',
          width: 500,
          height: 450,
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <BooksHero
        query={query}
        onQueryChange={setQuery}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
      />

      {/* Results section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', xl: '1400px' },
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {searchMode === 'books' && (hasSearched || isLoading) && (
          <BooksFilters
            filters={filters}
            filterOptions={filterOptions}
            activeFiltersCount={activeFiltersCount}
            resultsCount={filteredBooks.length}
            onAuthorChange={setAuthor}
            onSeriesChange={setSeries}
            onSortByChange={setSortBy}
            onReset={resetFilters}
          />
        )}

        {showBooksGrid && (
          <BooksGrid books={filteredBooks} isLoading={isLoading} />
        )}

        {searchMode === 'authors' && isLoading && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 6px)',
                    lg: 'calc(33.333% - 8px)',
                  },
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={72}
                  sx={{
                    borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {searchMode === 'authors' && !isLoading && authors.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {authors.map((author) => (
              <Box
                key={author.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 6px)',
                    lg: 'calc(33.333% - 8px)',
                  },
                }}
              >
                <AuthorCard author={author} />
              </Box>
            ))}
          </Box>
        )}

        {showBooksEmpty && (
          <BooksEmptyState
            hasSearched={true}
            hasActiveFilters={activeFiltersCount > 0}
            onResetFilters={resetFilters}
          />
        )}
        {showAuthorsEmpty && (
          <BooksEmptyState
            hasSearched={true}
            hasActiveFilters={false}
            onResetFilters={resetFilters}
          />
        )}
        {!hasSearched && !isLoading && (
          <BooksEmptyState
            hasSearched={false}
            hasActiveFilters={false}
            onResetFilters={resetFilters}
          />
        )}
      </Box>
    </Box>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={<Box sx={{ minHeight: '100vh', bgcolor: '#0A0A0A' }} />}
    >
      <BooksContent />
    </Suspense>
  );
}
