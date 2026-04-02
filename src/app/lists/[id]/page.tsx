'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Container,
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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
import { useParams } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';
import { useList } from '@/hooks/useList';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import { useDebounce } from '@/hooks/useDebounce';
import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { BookListItem } from '@/domain/list.model';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnrichedItem extends BookListItem {
  title: string;
  coverUrl: string;
}

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

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }}
      sx={{
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.025)',
        transition: 'border-color 0.15s ease',
        '&:hover': { borderColor: 'rgba(168,85,247,0.4)' },
        '&:hover .card-drag': { opacity: 1 },
        '&:hover .card-remove': { opacity: 1 },
      }}
    >
      {canEdit && (
        <Box
          {...attributes}
          {...listeners}
          className="card-drag"
          sx={{
            position: 'absolute',
            top: 5,
            left: 5,
            zIndex: 3,
            cursor: 'grab',
            color: '#fff',
            background: 'rgba(0,0,0,0.55)',
            borderRadius: '5px',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            opacity: 0,
            transition: 'opacity 0.12s ease',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: 14 }} />
        </Box>
      )}

      {canEdit && (
        <Box
          className="card-remove"
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            zIndex: 3,
            opacity: 0,
            transition: 'opacity 0.12s ease',
          }}
        >
          <Tooltip title="Remove" placement="top">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              sx={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                color: 'rgba(255,255,255,0.7)',
                width: 24,
                height: 24,
                '&:hover': { background: 'rgba(239,68,68,0.9)', color: '#fff' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box
        component={Link}
        href={`/books/${item.id}`}
        sx={{
          display: 'block',
          position: 'relative',
          width: '100%',
          paddingTop: '150%',
          background: 'rgba(255,255,255,0.04)',
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

      <Box sx={{ p: 1.25 }}>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.75)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {item.title || item.id}
        </Typography>
      </Box>
    </Box>
  );
};

// ─── DragOverlayCard ──────────────────────────────────────────────────────────

const DragOverlayCard: React.FC<{ item: EnrichedItem; width: number }> = ({
  item,
  width,
}) => (
  <Box
    sx={{
      width,
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid rgba(168,85,247,0.5)',
      background: 'rgba(168,85,247,0.06)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '150%',
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      <Image
        src={item.coverUrl}
        alt={item.title}
        fill
        style={{ objectFit: 'cover' }}
        sizes="20vw"
        unoptimized
      />
    </Box>
    <Box sx={{ p: 1.25 }}>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: 11,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.75)',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {item.title || item.id}
      </Typography>
    </Box>
  </Box>
);

// ─── AddBookSearch ─────────────────────────────────────────────────────────────

interface AddBookSearchProps {
  existingIds: Set<string>;
  onAdd: (bookId: string) => Promise<void>;
}

const AddBookSearch: React.FC<AddBookSearchProps> = ({
  existingIds,
  onAdd,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HardcoverBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    fetch('/api/hardcover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: debouncedQuery }),
    })
      .then((r) => r.json())
      .then((data: HardcoverBook[]) => {
        if (!cancelled) setResults(data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

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
        placeholder="Search books to add…"
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
                  <Tooltip
                    title={already ? 'Already in list' : 'Add to list'}
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

  const { user } = useGyCodingUser();
  const { list, isLoading, removeBook, updateBook, addBook, updateMeta } =
    useList(listId);

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

  // Hardcover enrichment
  const bookIds = useMemo(
    () => list?.books.map((b) => b.id) ?? [],
    [list?.books]
  );
  const { data: hardcoverBooks } = useHardcoverBatch(
    bookIds.length > 0 ? bookIds : null
  );

  const enrichMap = useMemo(() => {
    const map = new Map<string, { title: string; coverUrl: string }>();
    hardcoverBooks?.forEach((book: HardcoverBook) => {
      map.set(String(book.id), {
        title: BookHelpers.getDisplayTitle(book),
        coverUrl: BookHelpers.getDisplayCoverUrl(book),
      });
    });
    return map;
  }, [hardcoverBooks]);

  const itemMap = useMemo(() => {
    const map = new Map<string, EnrichedItem>();
    list?.books.forEach((b) => {
      map.set(b.id, {
        ...b,
        title: enrichMap.get(b.id)?.title ?? b.title ?? '',
        coverUrl:
          enrichMap.get(b.id)?.coverUrl ?? b.coverUrl ?? DEFAULT_COVER_IMAGE,
      });
    });
    return map;
  }, [list?.books, enrichMap]);

  const sortedItems = orderedIds
    .map((id) => itemMap.get(id))
    .filter((i): i is EnrichedItem => !!i);
  const existingIds = useMemo(() => new Set(orderedIds), [orderedIds]);
  const activeItem = activeId ? (itemMap.get(activeId) ?? null) : null;
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
    await updateBook(active.id as string, newIndex + 1);
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
    await addBook(bookId, orderedIds.length + 1);
    // Auto-update ordered ids
    setOrderedIds((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]));
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
      {/* Back */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          component={Link}
          href="/profile?tab=4"
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
            Lists
          </Typography>
        </IconButton>
      </Box>

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
            List not found.
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
                  placeholder="List name"
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
                  placeholder="Description (optional)"
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
                  <Tooltip title="Save">
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
                  <Tooltip title="Cancel">
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
                    <Tooltip title="Edit name & description" placement="right">
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
                    {sortedItems.length} book
                    {sortedItems.length !== 1 ? 's' : ''}
                    {canEdit && sortedItems.length > 1 && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 1.5,
                          color: 'rgba(255,255,255,0.15)',
                          fontSize: 11,
                        }}
                      >
                        · drag to reorder
                      </Typography>
                    )}
                  </Typography>

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
                        Add books
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
                This list is empty. Add some books above.
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
                items={orderedIds}
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
