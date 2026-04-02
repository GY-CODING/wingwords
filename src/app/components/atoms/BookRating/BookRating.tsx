'use client';

import { useRemoveBook } from '@/hooks/useRemoveBook';
import { useUser } from '@/hooks/useUser';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import BookRatingDrawer from './BookRatingDrawer';
import BookRatingMenu from './BookRatingMenu';
import { statusOptions } from './BookRatingOptions';
import { useBookRatingState } from './hooks/useBookRatingState';
import { BookRatingProps } from './types';
import { useTranslation } from '@/lib/i18n/I18nProvider';
export const BookRating = ({
  bookId,
  apiBook,
  isRatingLoading,
  mutate,
  isLoggedIn,
  selectedEdition,
}: BookRatingProps) => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { handleDeleteBook } = useRemoveBook();
  // Local delete handler for BookRatingMenu/Drawer
  const localHandleDeleteBook = () => {
    if (isBookSaved) {
      handleDeleteBook(
        bookId,
        mutate
          ? (data, options) =>
              mutate({ ...apiBook, userData: undefined }, options)
          : undefined
      );
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use custom hook for all state/logic
  const { state, handlers, anchorEl, setAnchorEl, drawerOpen, setDrawerOpen } =
    useBookRatingState({
      bookId,
      apiBook,
      isRatingLoading,
      mutate,
      isLoggedIn: false,
      selectedEdition,
    });

  // Local computed values
  const isBookSaved =
    apiBook && apiBook.userData && apiBook.userData.status !== EBookStatus.RATE;
  const isLoading = isUserLoading || isRatingLoading;
  const isSubmitting = state.isSubmitting;
  const displayStatus = state.tempStatus;
  const displayStatusOption = statusOptions.find(
    (opt) => opt.value === displayStatus
  );
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: { xs: 'center', sm: 'flex-start' },
        width: 'auto',
      }}
    >
      <Box>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<BookmarkIcon />}
          endIcon={<ArrowDropDownIcon />}
          disabled={!isLoggedIn}
          onClick={(e) => {
            if (isMobile) setDrawerOpen(true);
            else setAnchorEl(e.currentTarget);
          }}
          sx={{
            justifyContent: 'space-between',
            color: isBookSaved ? '#fff' : '#ccc',
            borderColor: isBookSaved
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: lora.style.fontFamily,
            letterSpacing: '.05rem',
            borderRadius: '12px',
            background: isBookSaved
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(255, 255, 255, 0.03)',
            px: 2,
            py: 1,
            textTransform: 'none',
            opacity: !user ? 0.5 : 1,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.25)',
              background: isBookSaved
                ? 'rgba(255, 255, 255, 0.18)'
                : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
            '&:disabled': {
              borderColor: '#666',
              color: '#666',
              background: 'rgba(102,102,102,0.1)',
            },
          }}
        >
          {displayStatusOption
            ? t(displayStatusOption.labelKey)
            : t('book.rating.status.wantToRead')}
        </Button>
        {!user && !isUserLoading && (
          <Typography variant="caption" sx={{ color: '#666' }}>
            {t('book.rating.signIn')}
          </Typography>
        )}
        {/* Desktop menu */}
        <BookRatingMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && !isMobile}
          onClose={() => setAnchorEl(null)}
          state={state}
          handlers={handlers}
          isBookSaved={!!isBookSaved}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          fontFamily={lora.style.fontFamily}
          handleDeleteBook={localHandleDeleteBook}
        />
        <BookRatingDrawer
          open={drawerOpen && isMobile}
          onClose={() => setDrawerOpen(false)}
          state={state}
          handlers={handlers}
          isBookSaved={!!isBookSaved}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          fontFamily={lora.style.fontFamily}
          handleDeleteBook={localHandleDeleteBook}
        />
      </Box>
    </Box>
  );
};
