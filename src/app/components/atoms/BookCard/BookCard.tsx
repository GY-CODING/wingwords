import type HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

function useIsEllipsis() {
  const ref = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isTruncated };
}

interface BookCardProps {
  book: HardcoverBook;
  compact?: boolean;
}

export function BookCard({ book, compact = false }: BookCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { title, coverUrl } = useBookDisplay(book)!;
  const { ref: titleRef, isTruncated } = useIsEllipsis();
  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      key={book.id}
      sx={{
        width: '100%',
        height: '100%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'row',
        gap: compact ? { xs: '8px', md: '12px' } : { xs: '10px', md: '16px' },
        padding: compact
          ? { xs: '8px', md: '12px' }
          : { xs: '10px', sm: '12px', md: '16px' },
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: compact
          ? { xs: '14px', md: '16px' }
          : { xs: '16px', md: '20px' },
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
        },
      }}
    >
      <Box
        sx={{
          width: compact
            ? { xs: '56px', sm: '65px', md: '80px' }
            : { xs: '64px', sm: '80px', md: '104px' },
          flexShrink: 0,
          alignSelf: 'stretch',
          overflow: 'hidden',
          borderRadius: { xs: '10px', md: '12px' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease',
            display: 'block',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
          src={coverUrl}
          alt={title}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: compact ? { xs: '4px', md: '6px' } : { xs: '5px', md: '7px' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box>
          <Tooltip
            title={isTruncated ? title : ''}
            arrow
            placement="top"
            disableHoverListener={!isTruncated}
          >
            <Typography
              ref={titleRef}
              sx={{
                color: '#fff',
                fontSize: compact
                  ? { xs: '13px', sm: '14px', md: '16px' }
                  : { xs: '15px', sm: '17px', md: '20px' },
                fontWeight: '700',
                fontFamily: lora.style.fontFamily,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </Typography>
          </Tooltip>

          {/* Como en la app: autor en gris y la saga como chip morado */}
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: compact
                ? { xs: '12px', sm: '13px', md: '14px' }
                : { xs: '14px', sm: '15px', md: '15px' },
              fontFamily: lora.style.fontFamily,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 0.5,
            }}
          >
            {book.author.name}
          </Typography>
          {book.series && book.series.length > 0 && book.series[0]?.name && (
            <Box
              component="span"
              title={book.series[0].name}
              sx={{
                display: 'inline-block',
                maxWidth: '100%',
                mt: 0.75,
                px: 1.25,
                py: 0.4,
                borderRadius: '8px',
                background: 'rgba(147, 51, 234, 0.16)',
                color: '#c4a1ff',
                fontSize: compact ? '11px' : '12.5px',
                fontFamily: lora.style.fontFamily,
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'top',
              }}
            >
              {book.series[0].name}
            </Box>
          )}
        </Box>

        {book.description && !compact && (
          <Typography
            sx={{
              display: { xs: 'none', xl: '-webkit-box' },
              color: 'rgba(255, 255, 255, 0.55)',
              fontSize: '12px',
              fontFamily: lora.style.fontFamily,
              fontWeight: '300',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
        )}

        {(book.averageRating ?? 0) > 0 && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}
          >
            <StarIcon sx={{ color: '#f59e0b', fontSize: 13 }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: compact ? '11px' : '12px',
                fontFamily: lora.style.fontFamily,
              }}
            >
              {book.averageRating.toFixed(1)}
            </Typography>
          </Box>
        )}
      </Box>
      <ChevronRightIcon
        aria-hidden
        sx={{
          alignSelf: 'center',
          flexShrink: 0,
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: 22,
          transition: 'transform 0.2s, color 0.2s',
          '.MuiBox-root:hover > &': {
            color: '#c084fc',
            transform: 'translateX(2px)',
          },
        }}
      />
    </Box>
  );
}
