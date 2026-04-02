import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import {
  Box,
  Chip,
  Dialog,
  LinearProgress,
  Rating,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;

interface BookCardCompactProps {
  book: HardcoverBook;
  onClick?: () => void;
}

export const BookCardCompactSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Skeleton de la imagen */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // Aspect ratio 2:3
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
          animation="wave"
        />
      </Box>

      {/* Skeleton del contenido */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Skeleton del título */}
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />

        {/* Skeleton del rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
        </Box>

        {/* Skeleton de las estadísticas */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: 0.5 }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
        </Box>

        {/* Skeleton del autor */}
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />

        {/* Skeleton del chip de serie */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />
      </Box>
    </Box>
  );
};

export const BookCardCompact = ({ book, onClick }: BookCardCompactProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { title, coverUrl } = useBookDisplay(book)!;
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/books/${book.id}`);
    }
  };

  // Status badge configuration
  const statusConfig = {
    [EBookStatus.READING]: {
      label: t('book.rating.status.reading'),
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.8)',
    },
    [EBookStatus.READ]: {
      label: t('book.rating.status.read'),
      color: '#6ee7b7',
      bg: 'rgba(110, 231, 183, 0.75)',
    },
    [EBookStatus.WANT_TO_READ]: {
      label: t('book.rating.status.wantToRead'),
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.7)',
    },
    [EBookStatus.RATE]: {
      label: t('book.card.status.rated'),
      color: '#6ee7b7',
      bg: 'rgba(110, 231, 183, 0.75)',
    },
  };

  const currentStatus = book.userData?.status || EBookStatus.WANT_TO_READ;
  const statusInfo =
    statusConfig[currentStatus] ?? statusConfig[EBookStatus.WANT_TO_READ];

  // Calculate progress if reading (userData.progress is a 0–1 fraction)
  const progress =
    currentStatus === EBookStatus.READING && book.userData?.progress
      ? Math.round(book.userData.progress * 100)
      : null;

  const editionPages =
    BookHelpers.getSelectedEdition(book)?.pages ??
    (book.pageCount > 0 ? book.pageCount : null);

  return (
    <MotionBox
      component="a"
      href={`/books/${book.id}`}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleClick();
      }}
      sx={{
        width: 'auto',
        minWidth: 'auto',
        maxWidth: 'auto',
        margin: 'auto',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.25s ease',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Status Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
        }}
      >
        <Chip
          label={statusInfo.label}
          size="small"
          sx={{
            height: 24,
            background: `${statusInfo.bg}`,

            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            border: `1px solid ${statusInfo.color}`,
            boxShadow: 'none',
            textShadow: 'none',
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />
      </Box>

      {/* Imagen del libro */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={coverUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          padding: { xs: '12px', sm: '16px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '6px', sm: '8px' },
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 100%)',
        }}
      >
        {/* Título y Rating */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '2px', sm: '4px' },
          }}
        >
          <Tooltip title={title} arrow placement="top">
            <Typography
              variant="subtitle1"
              sx={{
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontFamily: lora.style.fontFamily,
                letterSpacing: '.05rem',
                lineHeight: 1.3,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textShadow: 'none',
              }}
            >
              {title}
            </Typography>
          </Tooltip>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.03rem',
              fontWeight: '500',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: 'none',
            }}
          >
            {book.author.name}
          </Typography>
          {/* Rating + info row — siempre presentes para igualar altura */}
          <Box sx={{ mt: 0.5 }}>
            {book.userData?.rating !== undefined ? (
              <Rating
                value={book.userData.rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#a855f7',
                    filter: book.userData?.review
                      ? 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.7))'
                      : 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              />
            ) : (
              <Box sx={{ height: 20 }} />
            )}
            <Box sx={{ mt: 0.5, minHeight: 22 }}>
              {progress !== null ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#818cf8',
                        fontFamily: lora.style.fontFamily,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {t('book.rating.status.reading')}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: lora.style.fontFamily,
                        fontSize: '0.65rem',
                      }}
                    >
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(129, 140, 248, 0.15)',
                      '& .MuiLinearProgress-bar': {
                        background:
                          'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)',
                        borderRadius: 2,
                      },
                    }}
                  />
                </>
              ) : book.userData?.review ? (
                <Box
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReviewModalOpen(true);
                  }}
                  sx={{
                    pl: 1,
                    borderLeft: '2px solid rgba(168, 85, 247, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderLeftColor: 'rgba(168, 85, 247, 0.7)',
                      background: 'rgba(147, 51, 234, 0.05)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.38)',
                      fontFamily: lora.style.fontFamily,
                      fontStyle: 'italic',
                      fontSize: '0.7rem',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    &ldquo;{book.userData.review}&rdquo;
                  </Typography>
                </Box>
              ) : editionPages !== null ? (
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.39)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: '0.65rem',
                    lineHeight: '22px',
                    letterSpacing: '0.04em',
                    userSelect: 'none',
                  }}
                >
                  {t('book.card.pages', { count: editionPages })}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Box>

        {/* Series — siempre reserva espacio para igualar altura */}
        <Box sx={{ minHeight: { xs: 30, sm: 32 }, mt: 0.5 }}>
          {book.series && book.series.length > 0 && book.series[0]?.name && (
            <Chip
              label={book.series[0].name}
              size="small"
              sx={{
                alignSelf: 'flex-start',
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
                color: '#c084fc',
                fontSize: { xs: '.75rem', sm: '.85rem' },
                fontFamily: lora.style.fontFamily,
                letterSpacing: '.05rem',
                fontWeight: '700',
                height: { xs: '22px', sm: '24px' },
                borderRadius: '12px',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                textShadow: 'none',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Modal de review */}
      <Dialog
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-end', sm: 'center' },
          },
        }}
        PaperProps={{
          sx: {
            background: 'rgba(8, 4, 18, 0.27)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderBottom: {
              xs: 'none',
              sm: '1px solid rgba(168, 85, 247, 0.2)',
            },
            borderRadius: { xs: '20px 20px 0 0', sm: '20px' },
            m: { xs: 0, sm: 2 },
            maxWidth: { xs: '100%', sm: 400 },
            width: '100%',
          },
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative' }}>
          {/* Drag handle — visible only on mobile */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.15)',
              }}
            />
          </Box>

          {/* Close button */}
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setReviewModalOpen(false);
            }}
            sx={{
              position: 'absolute',
              top: { xs: 16, sm: 20 },
              right: { xs: 16, sm: 20 },
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.07)',
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': { background: 'rgba(255,255,255,0.12)' },
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '1.2rem',
                lineHeight: 1,
                userSelect: 'none',
                mt: '-1px',
              }}
            >
              &times;
            </Typography>
          </Box>

          {/* Book title + author */}
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 800,
              fontSize: '1rem',
              color: '#fff',
              pr: 4,
              mb: 0.25,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.4)',
              mb: 1.5,
            }}
          >
            {book.author.name}
          </Typography>

          {/* Stars */}
          {book.userData?.rating !== undefined && (
            <Rating
              value={book.userData.rating}
              precision={0.5}
              readOnly
              size="small"
              sx={{
                display: 'flex',
                mb: 2,
                '& .MuiRating-iconFilled': {
                  color: '#a855f7',
                  filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.6))',
                },
                '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' },
              }}
            />
          )}

          {/* Review text */}
          <Box
            sx={{ pl: 1.5, borderLeft: '2px solid rgba(168, 85, 247, 0.4)' }}
          >
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontStyle: 'italic',
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.75,
              }}
            >
              &ldquo;{book.userData?.review}&rdquo;
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </MotionBox>
  );
};
