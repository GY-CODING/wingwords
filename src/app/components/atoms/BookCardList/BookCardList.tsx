'use client';
import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Typography } from '@mui/material';

interface BookCardListProps {
  book: HardcoverBook;
}

/**
 * Fila de la vista lista del perfil, como en la app: portada, título, autor,
 * una línea de estado con su icono y color (+ valoración y páginas) y la saga
 * en un chip morado.
 */
export const BookCardList = ({ book }: BookCardListProps) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { title, coverUrl } = useBookDisplay(book)!;
  const { t } = useTranslation();

  const status = (book.userData?.status as string) || '';
  const STATUS: Record<
    string,
    { label: string; color: string; icon: typeof BookmarkBorderIcon }
  > = {
    [EBookStatus.READING]: {
      label: t('book.rating.status.reading'),
      color: '#818cf8',
      icon: MenuBookOutlinedIcon,
    },
    [EBookStatus.READ]: {
      label: t('book.rating.status.read'),
      color: '#5ee6a8',
      icon: CheckCircleOutlineIcon,
    },
    [EBookStatus.RATE]: {
      label: t('book.rating.status.read'),
      color: '#5ee6a8',
      icon: CheckCircleOutlineIcon,
    },
    [EBookStatus.WANT_TO_READ]: {
      label: t('book.rating.status.wantToRead'),
      color: '#fbbf24',
      icon: BookmarkBorderIcon,
    },
    NOT_FINISHED: {
      label: t('book.rating.status.notFinished'),
      color: '#f87171',
      icon: HighlightOffIcon,
    },
    DNF: {
      label: t('book.rating.status.notFinished'),
      color: '#f87171',
      icon: HighlightOffIcon,
    },
  };
  const statusInfo = STATUS[status];
  const StatusIcon = statusInfo?.icon;
  const rating = book.userData?.rating ?? 0;
  const pages =
    BookHelpers.getSelectedEdition(book)?.pages ??
    (book.pageCount > 0 ? book.pageCount : null);

  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        p: 1.75,
        minWidth: 0,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '18px',
        textDecoration: 'none',
        transition:
          'background-color 0.2s, border-color 0.2s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(147, 51, 234, 0.25)',
          transform: 'translateY(-2px)',
        },
        '&:focus-visible': {
          outline: '2px solid rgba(192, 132, 252, 0.7)',
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 96,
          flexShrink: 0,
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 6px 16px -6px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Box
          component="img"
          src={coverUrl}
          alt={title}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.4,
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.85rem',
            fontFamily: lora.style.fontFamily,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {book.author.name}
        </Typography>

        {/* Estado · valoración · páginas */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            flexWrap: 'wrap',
            fontFamily: lora.style.fontFamily,
            fontSize: '0.8rem',
          }}
        >
          {statusInfo && StatusIcon && (
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: statusInfo.color,
              }}
            >
              <StatusIcon sx={{ fontSize: 15 }} />
              {statusInfo.label}
            </Box>
          )}
          {rating > 0 && (
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.25,
                color: '#fbbf24',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 15 }} />
              {rating.toFixed(1)}
            </Box>
          )}
          {pages !== null && (
            <Box
              component="span"
              sx={{
                color: 'rgba(255, 255, 255, 0.45)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pages} p.
            </Box>
          )}
        </Box>

        {book.series && book.series.length > 0 && book.series[0]?.name && (
          <Box
            component="span"
            title={book.series[0].name}
            sx={{
              alignSelf: 'flex-start',
              maxWidth: '100%',
              mt: 0.5,
              px: 1.1,
              py: 0.3,
              borderRadius: '8px',
              background: 'rgba(147, 51, 234, 0.16)',
              color: '#c4a1ff',
              fontSize: '0.75rem',
              fontFamily: lora.style.fontFamily,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {book.series[0].name}
          </Box>
        )}
      </Box>
    </Box>
  );
};
