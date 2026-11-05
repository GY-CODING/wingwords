/* eslint-disable @typescript-eslint/no-unused-vars */
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography, Chip } from '@mui/material';
import { BooksList } from '../BooksList/BooksList';
import { BooksListSkeleton } from '../BooksList/BooksListSkeleton';
import { UserProfileBook } from '@/domain/user.model';
import {
  ProfileFilters,
  ProfileFiltersActions,
  ProfileFilterOptions,
  ViewType,
} from '../../utils/profileTypes';

interface BooksTabProps {
  books: UserProfileBook[];
  filteredBooks: UserProfileBook[];
  loading: boolean;
  hasMore: boolean;
  filterOptions: ProfileFilterOptions;
  filters: ProfileFilters & ProfileFiltersActions;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function BooksTab({
  books,
  filteredBooks,
  loading,
  hasMore,
  filterOptions,
  filters,
  view,
  onViewChange,
}: BooksTabProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Filters will be rendered inline with navigation in parent component */}

      {/* Books Content - Scrollable */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          paddingRight: { xs: 0, sm: 1 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(147, 51, 234, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #9333ea 0%, #a855f7 100%)',
            borderRadius: '4px',
            '&:hover': {
              background: 'linear-gradient(180deg, #7e22ce 0%, #9333ea 100%)',
            },
          },
        }}
      >
        {loading && books.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 60,
              width: '100%',
            }}
          >
            <BooksListSkeleton view={view} />
          </Box>
        ) : books.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
              width: '100%',
            }}
          >
            <Typography
              sx={{ font: lora.style.fontFamily }}
              color="white"
              variant="h6"
            >
              You don&apos;t have any books in your library yet
            </Typography>
          </Box>
        ) : (
          <BooksList books={filteredBooks} hasMore={hasMore} view={view} />
        )}
      </Box>
    </Box>
  );
}
