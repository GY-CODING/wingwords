'use client';

import { useRemoveBook } from '@/hooks/useRemoveBook';
import { useUser } from '@/hooks/useUser';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
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

  // Como en la app: el botón se tiñe del color del estado guardado
  const STATUS_TINT: Record<string, string> = {
    [EBookStatus.READ]: '#5ee6a8',
    [EBookStatus.READING]: '#818cf8',
    [EBookStatus.WANT_TO_READ]: '#fbbf24',
    NOT_FINISHED: '#f87171',
    DNF: '#f87171',
  };
  const tint =
    (isBookSaved && STATUS_TINT[displayStatus as string]) || '#a855f7';
  const StatusIcon =
    displayStatus === EBookStatus.READ
      ? CheckCircleOutlineIcon
      : displayStatus === EBookStatus.READING
        ? MenuBookOutlinedIcon
        : ['NOT_FINISHED', 'DNF'].includes(displayStatus as string)
          ? HighlightOffIcon
          : BookmarkIcon;

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
          startIcon={<StatusIcon />}
          endIcon={<ArrowDropDownIcon />}
          disabled={!isLoggedIn}
          onClick={(e) => {
            if (isMobile) setDrawerOpen(true);
            else setAnchorEl(e.currentTarget);
          }}
          sx={{
            justifyContent: 'center',
            gap: 0.5,
            minWidth: 220,
            color: tint,
            borderColor: `${tint}66`,
            fontWeight: 700,
            fontSize: 18,
            fontFamily: lora.style.fontFamily,
            borderRadius: '16px',
            background: `${tint}14`,
            px: 2.5,
            py: 1.1,
            textTransform: 'none',
            opacity: !user ? 0.5 : 1,
            transition: 'background-color 0.2s, border-color 0.2s',
            '&:hover': {
              borderColor: `${tint}aa`,
              background: `${tint}24`,
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
