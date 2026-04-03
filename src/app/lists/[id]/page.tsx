'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SearchIcon from '@mui/icons-material/Search';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/hooks/useTranslation';
import { useList } from '@/hooks/useList';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import useLibrary from '@/hooks/books/useLibrary';
import { useDebounce } from '@/hooks/useDebounce';
import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { BookListItem } from '@/domain/list.model';
import { EBookStatus } from '@gycoding/nebula';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnrichedItem extends BookListItem {
  title: string;
  coverUrl: string;
  authorName: string;
  seriesName: string | null;
  status: EBookStatus | null;
  isEnriching: boolean;
}

// ─── Status config ────────────────────────────────────────────────────────────

function useStatusConfig(): Record<
  string,
  { label: string; color: string; bg: string }
> {
  const { t } = useTranslation();
  return {
    [EBookStatus.READING]: {
      label: t('lists.status.reading'),
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.8)',
    },
    [EBookStatus.READ]: {
      label: t('lists.status.read'),
      color: '#6ee7b7',
      bg: 'rgba(110,231,183,0.75)',
    },
    [EBookStatus.WANT_TO_READ]: {
      label: t('lists.status.want-to-read'),
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.7)',
    },
    [EBookStatus.RATE]: {
      label: t('lists.status.read'),
      color: '#6ee7b7',
      bg: 'rgba(110,231,183,0.75)',
    },
  };
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

const DonutChart: React.FC<{ percent: number; size?: number }> = ({
  percent,
  size = 40,
}) => {
  const sw = 4;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(percent, 100) / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={sw}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#a855f7"
        strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
};

// ─── BookGridCard ─────────────────────────────────────────────────────────────

interface BookGridCardProps {
  item: EnrichedItem;
  canEdit: boolean;
  onRemove: (id: string) => void;
}

const BookGridCard: React.FC<BookGridCardProps> = ({
  item,
  canEdit,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const { t } = useTranslation();
  const STATUS_CONFIG = useStatusConfig();
  const statusInfo = item.status ? STATUS_CONFIG[item.status] : null;

  // While Hardcover enrichment is pending, show a placeholder skeleton
  if (item.isEnriching) {
    return (
      <Box
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        {...(canEdit ? { ...attributes, ...listeners } : {})}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ paddingTop: '150%', bgcolor: 'rgba(255,255,255,0.07)' }}
        />
        <Box
          sx={{
            p: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <Skeleton
            variant="text"
            width="75%"
            height={16}
            sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={12}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }}
      {...(canEdit ? { ...attributes, ...listeners } : {})}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: canEdit ? 'grab' : 'default',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(168,85,247,0.4)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        },
        '&:hover .card-remove': { opacity: 1 },
        '&:active': { cursor: canEdit ? 'grabbing' : 'default' },
      }}
    >
      {/* Status badge */}
      {statusInfo && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
          <Chip
            label={statusInfo.label}
            size="small"
            sx={{
              height: 22,
              background: statusInfo.bg,
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
              border: `1px solid ${statusInfo.color}`,
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        </Box>
      )}

      {/* Remove button */}
      {canEdit && (
        <Box
          className="card-remove"
          onPointerDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 3,
            opacity: 0,
            transition: 'opacity 0.12s ease',
          }}
        >
          <Tooltip title={t('lists.detail.remove')} placement="top">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              sx={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: 'rgba(255,255,255,0.7)',
                width: 26,
                height: 26,
                '&:hover': { background: 'rgba(239,68,68,0.9)', color: '#fff' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Cover */}
      <Box
        component={Link}
        href={`/books/${item.id}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => isDragging && e.preventDefault()}
        sx={{
          display: 'block',
          position: 'relative',
          width: '100%',
          paddingTop: '150%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Image
          src={item.coverUrl}
          alt={item.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 20vw"
          unoptimized
        />
      </Box>

      {/* Info */}
      <Box
        sx={{
          p: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)',
        }}
      >
        <Tooltip title={item.title} arrow placement="top">
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '.04rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title || item.id}
          </Typography>
        </Tooltip>

        {item.authorName && (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.authorName}
          </Typography>
        )}

        {item.seriesName && (
          <Chip
            label={item.seriesName}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mt: 0.5,
              height: 22,
              fontFamily: lora.style.fontFamily,
              fontSize: '0.65rem',
              fontWeight: 600,
              background: 'rgba(168,85,247,0.12)',
              color: '#c084fc',
              border: '1px solid rgba(168,85,247,0.28)',
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// ─── DragOverlayCard ──────────────────────────────────────────────────────────

const DragOverlayCard: React.FC<{ item: EnrichedItem; width: number }> = ({
  item,
  width,
}) => {
  const STATUS_CONFIG = useStatusConfig();
  const statusInfo = item.status ? STATUS_CONFIG[item.status] : null;
  return (
    <Box
      sx={{
        width,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(168,85,247,0.5)',
        background: 'rgba(168,85,247,0.06)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {statusInfo && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
          <Chip
            label={statusInfo.label}
            size="small"
            sx={{
              height: 22,
              background: statusInfo.bg,
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: '0.65rem',
              border: `1px solid ${statusInfo.color}`,
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        </Box>
      )}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '150%' }}>
        <Image
          src={item.coverUrl}
          alt={item.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="20vw"
          unoptimized
        />
      </Box>
      <Box
        sx={{
          p: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: 800,
            fontSize: '0.95rem',
            color: '#fff',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.title || item.id}
        </Typography>
        {item.authorName && (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.authorName}
          </Typography>
        )}
        {item.seriesName && (
          <Chip
            label={item.seriesName}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mt: 0.5,
              height: 22,
              fontFamily: lora.style.fontFamily,
              fontSize: '0.65rem',
              fontWeight: 600,
              background: 'rgba(168,85,247,0.12)',
              color: '#c084fc',
              border: '1px solid rgba(168,85,247,0.28)',
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// ─── AddBookSearch ─────────────────────────────────────────────────────────────

interface AddBookSearchProps {
  existingIds: Set<string>;
  libraryBookIds: Set<string>;
  onAdd: (bookId: string) => Promise<void>;
}

const AddBookSearch: React.FC<AddBookSearchProps> = ({
  existingIds,
  libraryBookIds,
  onAdd,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 350);

  const swrKey = debouncedQuery.trim()
    ? `hardcover-search|${debouncedQuery.trim().toLowerCase()}`
    : null;

  const { data: rawResults, isLoading: isSearching } = useSWR<HardcoverBook[]>(
    swrKey,
    async () => {
      const r = await fetch('/api/hardcover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: debouncedQuery }),
      });
      if (!r.ok) return [];
      return r.json();
    },
    {
      dedupingInterval: 60_000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: false,
    }
  );

  const results = useMemo(() => {
    if (!rawResults) return [];
    const sorted = [...rawResults].sort((a, b) => {
      const aInLib = libraryBookIds.has(String(a.id)) ? 0 : 1;
      const bInLib = libraryBookIds.has(String(b.id)) ? 0 : 1;
      return aInLib - bInLib;
    });
    return sorted.slice(0, 8);
  }, [rawResults, libraryBookIds]);

  const handleAdd = async (book: HardcoverBook) => {
    const id = String(book.id);
    setAddingId(id);
    await onAdd(id);
    setAddingId(null);
  };

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('lists.detail.search.placeholder')}
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: lora.style.fontFamily,
            fontSize: 13,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px',
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(168,85,247,0.6)' },
          },
          '& input::placeholder': {
            color: 'rgba(255,255,255,0.3)',
            fontFamily: lora.style.fontFamily,
          },
        }}
      />

      {(isSearching || results.length > 0) && (
        <Box
          sx={{
            mt: 1,
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(15,10,25,0.95)',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          {isSearching && (
            <Box
              sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={32}
                    height={44}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={16}
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                  />
                </Box>
              ))}
            </Box>
          )}
          {!isSearching &&
            results.map((book) => {
              const id = String(book.id);
              const already = existingIds.has(id);
              const inLibrary = libraryBookIds.has(id);
              return (
                <Box
                  key={id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    '&:last-child': { borderBottom: 'none' },
                    opacity: already ? 0.4 : 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 44,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <Image
                      src={BookHelpers.getDisplayCoverUrl(book)}
                      alt={book.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="32px"
                      unoptimized
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.8)',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {BookHelpers.getDisplayTitle(book)}
                  </Typography>
                  {inLibrary && !already && (
                    <Chip
                      label={t('lists.detail.in-library')}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 9,
                        fontFamily: lora.style.fontFamily,
                        fontWeight: 600,
                        background: 'rgba(168,85,247,0.12)',
                        color: '#c084fc',
                        border: '1px solid rgba(168,85,247,0.3)',
                        flexShrink: 0,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  )}
                  <Tooltip
                    title={
                      already
                        ? t('lists.detail.already-in-list')
                        : t('lists.detail.add-to-list')
                    }
                    placement="left"
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={already || addingId === id}
                        onClick={() => handleAdd(book)}
                        sx={{
                          flexShrink: 0,
                          width: 26,
                          height: 26,
                          background: already
                            ? 'transparent'
                            : 'rgba(168,85,247,0.15)',
                          color: already ? 'rgba(255,255,255,0.3)' : '#c084fc',
                          border: already
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(168,85,247,0.4)',
                          '&:hover:not(:disabled)': {
                            background: 'rgba(168,85,247,0.3)',
                            color: '#fff',
                          },
                          '&.Mui-disabled': { opacity: 0.4 },
                        }}
                      >
                        {already ? (
                          <CheckIcon sx={{ fontSize: 13 }} />
                        ) : (
                          <AddIcon sx={{ fontSize: 13 }} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ListDetailSkeleton: React.FC = () => (
  <Box>
    <Skeleton
      variant="text"
      width={200}
      height={38}
      sx={{ bgcolor: 'rgba(255,255,255,0.06)', mb: 1 }}
    />
    <Skeleton
      variant="text"
      width={320}
      height={18}
      sx={{ bgcolor: 'rgba(255,255,255,0.04)', mb: 3 }}
    />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2,1fr)',
          sm: 'repeat(3,1fr)',
          md: 'repeat(4,1fr)',
          lg: 'repeat(5,1fr)',
        },
        gap: 1.5,
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Skeleton
            variant="rectangular"
            sx={{ paddingTop: '150%', bgcolor: 'rgba(255,255,255,0.05)' }}
          />
          <Box sx={{ p: 1.25, background: 'rgba(255,255,255,0.02)' }}>
            <Skeleton
              variant="text"
              width="75%"
              height={14}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListDetailPage() {
  const params = useParams();
  const listId = params.id as string;
  const router = useRouter();

  const { t } = useTranslation();
  const { user } = useGyCodingUser();
  const {
    list,
    isLoading,
    removeBook,
    reorderBooks,
    addBook,
    updateMeta,
    deleteList,
  } = useList(listId);

  // Fetch user's full library (Redux store, populated by useProfilePage) to get userData per book
  const { data: userMergedBooks } = useLibrary(user?.id as string | undefined);

  // DnD state
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeWidth, setActiveWidth] = useState(180);

  // Edit meta state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  // Add books state
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (list) {
      setOrderedIds(
        list.books
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((b) => b.id)
      );
    }
  }, [list]);

  // Build a lookup map from the user's library (has userData: status, editionId, etc.)
  const userBooksMap = useMemo(() => {
    const map = new Map<string, HardcoverBook>();
    userMergedBooks?.forEach((book) => map.set(String(book.id), book));
    return map;
  }, [userMergedBooks]);

  const libraryBookIds = useMemo(
    () => new Set(userMergedBooks?.map((b) => String(b.id)) ?? []),
    [userMergedBooks]
  );

  // Hardcover enrichment — only fetch books NOT already in the user's library
  const bookIds = useMemo(
    () => list?.books.map((b) => b.id) ?? [],
    [list?.books]
  );
  const missingFromLibrary = useMemo(
    () => bookIds.filter((id) => !libraryBookIds.has(String(id))),
    [bookIds, libraryBookIds]
  );
  const { data: hardcoverBooks } = useHardcoverBatch(
    missingFromLibrary.length > 0 ? missingFromLibrary : null
  );

  const enrichMap = useMemo(() => {
    const map = new Map<
      string,
      {
        title: string;
        coverUrl: string;
        authorName: string;
        seriesName: string | null;
        status: EBookStatus | null;
      }
    >();

    // First pass: library books (available instantly from Redux cache)
    userBooksMap.forEach((book, id) => {
      map.set(id, {
        title: BookHelpers.getDisplayTitle(book),
        coverUrl: BookHelpers.getDisplayCoverUrl(book),
        authorName: book.author?.name ?? '',
        seriesName: book.series?.[0]?.name ?? null,
        status: (book.userData?.status as EBookStatus) ?? null,
      });
    });

    // Second pass: Hardcover data for books NOT in library
    hardcoverBooks?.forEach((book: HardcoverBook) => {
      const id = String(book.id);
      if (map.has(id)) return; // library data takes priority
      map.set(id, {
        title: BookHelpers.getDisplayTitle(book),
        coverUrl: BookHelpers.getDisplayCoverUrl(book),
        authorName: book.author?.name ?? '',
        seriesName: book.series?.[0]?.name ?? null,
        status: book.userData?.status ?? null,
      });
    });

    return map;
  }, [hardcoverBooks, userBooksMap]);

  const itemMap = useMemo(() => {
    const map = new Map<string, EnrichedItem>();
    list?.books.forEach((b) => {
      const id = String(b.id);
      const enriched = enrichMap.get(id);
      map.set(id, {
        ...b,
        id,
        title: enriched?.title ?? b.title ?? '',
        coverUrl: enriched?.coverUrl ?? b.coverUrl ?? DEFAULT_COVER_IMAGE,
        authorName: enriched?.authorName ?? '',
        seriesName: enriched?.seriesName ?? null,
        status: enriched?.status ?? null,
        isEnriching: !enriched,
      });
    });
    return map;
  }, [list?.books, enrichMap]);

  const sortedItems = orderedIds
    .map((id) => itemMap.get(String(id)))
    .filter((i): i is EnrichedItem => !!i);
  const existingIds = useMemo(() => new Set(orderedIds), [orderedIds]);
  const activeItem = activeId ? (itemMap.get(activeId) ?? null) : null;

  const { readCount, readPercent } = useMemo(() => {
    if (!userMergedBooks || !list || list.books.length === 0)
      return { readCount: 0, readPercent: 0 };
    const listIds = new Set(list.books.map((b) => b.id));
    const inList = userMergedBooks.filter((b) => listIds.has(String(b.id)));
    const read = inList.filter(
      (b) =>
        b.userData?.status === EBookStatus.READ ||
        b.userData?.status === EBookStatus.RATE
    ).length;
    return {
      readCount: read,
      readPercent: Math.round((read / list.books.length) * 100),
    };
  }, [userMergedBooks, list]);
  const canEdit = !!user;

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    const w = active.rect.current.initial?.width;
    if (w) setActiveWidth(w);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);
    const newOrder = arrayMove(orderedIds, oldIndex, newIndex);
    setOrderedIds(newOrder);
    await reorderBooks(newOrder);
  };

  // Edit handlers
  const startEdit = () => {
    setEditName(list?.name ?? '');
    setEditDesc(list?.description ?? '');
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = async () => {
    if (!editName.trim()) return;
    setIsSavingMeta(true);
    await updateMeta({
      name: editName.trim(),
      description: editDesc.trim() || undefined,
    });
    setIsSavingMeta(false);
    setIsEditing(false);
  };

  // Add book handler
  const handleAddBook = async (bookId: string) => {
    await addBook(bookId);
    // Auto-update ordered ids
    setOrderedIds((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]));
  };

  // Delete list handler
  const handleDeleteList = async () => {
    setIsDeleting(true);
    await deleteList();
    router.push('/profile?tab=1');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        pt: { xs: 3, md: 5 },
        pb: 8,
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
      }}
    >
      {/* Back + delete */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          component={Link}
          href="/profile?tab=1"
          sx={{
            color: 'rgba(255,255,255,0.45)',
            gap: 0.5,
            borderRadius: '9px',
            px: 1.5,
            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography sx={{ fontFamily: lora.style.fontFamily, fontSize: 13 }}>
            {t('profile.nav.lists')}
          </Typography>
        </IconButton>

        {canEdit && list && (
          <Tooltip title={t('lists.detail.delete-list')} placement="left">
            <IconButton
              onClick={() => setShowDeleteConfirm(true)}
              sx={{
                color: 'rgba(239,68,68,0.6)',
                borderRadius: '9px',
                border: '1px solid rgba(239,68,68,0.2)',
                '&:hover': {
                  color: '#ef4444',
                  background: 'rgba(239,68,68,0.08)',
                  borderColor: 'rgba(239,68,68,0.4)',
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        PaperProps={{
          sx: {
            background: 'rgba(20,12,35,0.98)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: lora.style.fontFamily,
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {t('lists.detail.delete-list')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 14,
            }}
          >
            {t('lists.detail.delete-list.confirm', { name: list?.name ?? '' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            sx={{
              fontFamily: lora.style.fontFamily,
              textTransform: 'none',
              color: 'rgba(255,255,255,0.5)',
              '&:hover': { color: '#fff' },
            }}
          >
            {t('lists.detail.cancel')}
          </Button>
          <Button
            onClick={handleDeleteList}
            disabled={isDeleting}
            sx={{
              fontFamily: lora.style.fontFamily,
              textTransform: 'none',
              fontWeight: 600,
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '9px',
              px: 2.5,
              '&:hover': {
                background: 'rgba(239,68,68,0.25)',
                borderColor: '#ef4444',
              },
              '&.Mui-disabled': { opacity: 0.5 },
            }}
          >
            {isDeleting
              ? t('lists.detail.deleting')
              : t('lists.detail.delete-list')}
          </Button>
        </DialogActions>
      </Dialog>

      {isLoading ? (
        <ListDetailSkeleton />
      ) : !list ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <FormatListBulletedIcon
            sx={{ fontSize: 48, color: 'rgba(255,255,255,0.12)', mb: 2 }}
          />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {t('lists.detail.not-found')}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            {isEditing ? (
              /* Edit mode */
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  maxWidth: 520,
                }}
              >
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t('lists.detail.name.placeholder')}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: lora.style.fontFamily,
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#fff',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(168,85,247,0.6)',
                      },
                    },
                  }}
                />
                <TextField
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder={t('lists.detail.description.placeholder')}
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: lora.style.fontFamily,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.6)',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(168,85,247,0.5)',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={t('lists.detail.save')}>
                    <IconButton
                      onClick={saveEdit}
                      disabled={isSavingMeta || !editName.trim()}
                      size="small"
                      sx={{
                        background: 'rgba(168,85,247,0.15)',
                        border: '1px solid rgba(168,85,247,0.4)',
                        color: '#c084fc',
                        '&:hover': { background: 'rgba(168,85,247,0.3)' },
                        '&.Mui-disabled': { opacity: 0.4 },
                      }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('lists.detail.cancel')}>
                    <IconButton
                      onClick={cancelEdit}
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.4)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              /* View mode */
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <FormatListBulletedIcon
                    sx={{ color: '#a855f7', fontSize: 22, flexShrink: 0 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: { xs: 22, md: 28 },
                    }}
                  >
                    {list.name}
                  </Typography>
                  {canEdit && (
                    <Tooltip
                      title={t('lists.detail.edit-meta')}
                      placement="right"
                    >
                      <IconButton
                        onClick={startEdit}
                        size="small"
                        sx={{
                          ml: 0.5,
                          color: 'rgba(255,255,255,0.2)',
                          '&:hover': {
                            color: '#c084fc',
                            background: 'rgba(168,85,247,0.1)',
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {list.description && (
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 13,
                      lineHeight: 1.6,
                      maxWidth: 560,
                      mb: 0.5,
                    }}
                  >
                    {list.description}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.22)',
                    }}
                  >
                    {sortedItems.length === 1
                      ? t('lists.card.books', { count: sortedItems.length })
                      : t('lists.card.books.plural', {
                          count: sortedItems.length,
                        })}
                    {canEdit && sortedItems.length > 1 && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 1.5,
                          color: 'rgba(255,255,255,0.15)',
                          fontSize: 11,
                        }}
                      >
                        · {t('lists.detail.drag-to-reorder')}
                      </Typography>
                    )}
                  </Typography>

                  {list.books.length > 0 && (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                    >
                      <DonutChart percent={readPercent} size={28} />
                      <Typography
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.22)',
                        }}
                      >
                        {t('lists.card.read', {
                          done: readCount,
                          total: list.books.length,
                        })}
                      </Typography>
                    </Box>
                  )}

                  {canEdit && (
                    <Box
                      onClick={() => {
                        setShowSearch((s) => !s);
                        setTimeout(
                          () =>
                            searchRef.current?.querySelector('input')?.focus(),
                          50
                        );
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        cursor: 'pointer',
                        borderRadius: '8px',
                        px: 1,
                        py: 0.5,
                        border: showSearch
                          ? '1px solid rgba(168,85,247,0.4)'
                          : '1px solid rgba(255,255,255,0.1)',
                        background: showSearch
                          ? 'rgba(168,85,247,0.1)'
                          : 'rgba(255,255,255,0.03)',
                        color: showSearch
                          ? '#c084fc'
                          : 'rgba(255,255,255,0.35)',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: 'rgba(168,85,247,0.4)',
                          color: '#c084fc',
                          background: 'rgba(168,85,247,0.08)',
                        },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                      <Typography
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {t('lists.detail.add-books')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Search panel */}
            {canEdit && showSearch && (
              <Box ref={searchRef} sx={{ maxWidth: 520 }}>
                <AddBookSearch
                  existingIds={existingIds}
                  libraryBookIds={libraryBookIds}
                  onAdd={handleAddBook}
                />
              </Box>
            )}
          </Box>

          {/* Grid */}
          {sortedItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  color: 'rgba(255,255,255,0.28)',
                  fontSize: 14,
                }}
              >
                {t('lists.detail.empty')}
              </Typography>
            </Box>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedItems.map((i) => i.id)}
                strategy={rectSortingStrategy}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2,1fr)',
                      sm: 'repeat(3,1fr)',
                      md: 'repeat(4,1fr)',
                      lg: 'repeat(5,1fr)',
                    },
                    gap: 1.5,
                  }}
                >
                  {sortedItems.map((item) => (
                    <BookGridCard
                      key={item.id}
                      item={item}
                      canEdit={canEdit}
                      onRemove={removeBook}
                    />
                  ))}
                </Box>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeItem ? (
                  <DragOverlayCard item={activeItem} width={activeWidth} />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </>
      )}
    </Container>
  );
}
