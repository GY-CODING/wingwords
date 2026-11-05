/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import {
  Activity,
  ActivityType,
  extractProgress,
  extractRating,
  getActivityColor,
  getActivityType,
} from '@/domain/activity.model';
import type HardcoverBook from '@/domain/HardcoverBook';
import { BookHelpers } from '@/domain/HardcoverBook';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import { useAppSelector } from '@/store/hooks';
import { useActivities } from '@/hooks/useActivities';
import { useTranslation } from '@/hooks/useTranslation';
import { translateActivityMessage } from '@/hooks/activities/utils/activityHelpers';
import { lora } from '@/utils/fonts/fonts';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import StarIcon from '@mui/icons-material/Star';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useActivityLike } from '@/hooks/activities/useActivityLike';

const MotionBox = motion(Box);

type ActivityEntry = Activity & { activityId?: string; likes?: string[] };

interface ActivityTabProps {
  id: UUID;
}

// Helper function to get icon component
const getActivityIconComponent = (type: ActivityType) => {
  switch (type) {
    case ActivityType.STARTED:
      return BookIcon;
    case ActivityType.FINISHED:
      return CheckCircleIcon;
    case ActivityType.RATED:
      return StarIcon;
    case ActivityType.PROGRESS:
      return BarChartIcon;
    case ActivityType.WANT_TO_READ:
      return BookmarkIcon;
    case ActivityType.OTHER:
      return CircleIcon;
    default:
      return CircleIcon;
  }
};

// Progreso como en la app: "40%" en morado y una barra fina a lo ancho
const ProgressBadge: React.FC<{ progress: number }> = React.memo(
  ({ progress }) => (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: '#c084fc',
          fontFamily: lora.style.fontFamily,
          fontVariantNumeric: 'tabular-nums',
          mb: 0.5,
        }}
      >
        {progress}%
      </Typography>
      <Box
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        sx={{
          height: 5,
          borderRadius: 999,
          background: 'rgba(147, 51, 234, 0.18)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${Math.max(0, Math.min(100, progress))}%`,
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
          }}
        />
      </Box>
    </Box>
  )
);

// Rating Badge Component
const RatingBadge: React.FC<{ rating: number }> = React.memo(({ rating }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.5,
      borderRadius: '8px',
      background: 'rgba(251, 191, 36, 0.12)',
      border: '1px solid rgba(251, 191, 36, 0.25)',
      color: '#fbbf24',
    }}
  >
    <StarIcon sx={{ fontSize: 14 }} />
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        fontFamily: lora.style.fontFamily,
      }}
    >
      {rating.toFixed(1)}
    </Typography>
  </Box>
));

// Book Cover Component with lazy loading
const BookCover: React.FC<{
  imageUrl: string | null;
  bookId: string;
  onLoad: () => void;
}> = React.memo(({ imageUrl, onLoad }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onLoad();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 72,
        height: 108,
        flexShrink: 0,
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
      }}
    >
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Book cover"
          onLoad={handleLoad}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </Box>
  );
});

// Activity Item Component
const ActivityItem: React.FC<{
  activity: ActivityEntry;
  index: number;
  bookImage: string | null;
  onImageLoad: () => void;
  currentUserId?: string;
  /** La actividad es del usuario que mira (su propio perfil). */
  isOwnActivity?: boolean;
  profileId: string;
  onLikeToggle: (
    activityId: string,
    profileId: string
  ) => Promise<string[] | null>;
}> = React.memo(
  ({
    activity,
    index,
    bookImage,
    onImageLoad,
    currentUserId,
    isOwnActivity = false,
    profileId,
    onLikeToggle,
  }) => {
    const activityType = getActivityType(activity.message);
    const ActivityIconComponent = getActivityIconComponent(activityType);
    const activityColor = getActivityColor(activityType);
    const progress = extractProgress(activity.message);
    const rating = extractRating(activity.message);
    const { t } = useTranslation();
    const displayMessage = translateActivityMessage(activity.message, t);

    const router = useRouter();
    const [likes, setLikes] = useState<string[]>(activity.likes ?? []);
    const [isLiking, setIsLiking] = useState(false);
    // En tus propias actividades no puedes darte "me gusta": el corazón sale
    // relleno si alguien se lo ha dado (≥1) y vacío solo con 0.
    const showFilled = (isLiked: boolean) =>
      isLiked || (isOwnActivity && likes.length > 0);
    const isLiked = useMemo(
      () => (currentUserId ? likes.includes(currentUserId) : false),
      [likes, currentUserId]
    );

    const handleCardClick = useCallback(() => {
      if (activity.bookId) router.push(`/books/${activity.bookId}`);
    }, [activity.bookId, router]);

    const handleLike = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        const activityId = activity.activityId;
        if (!currentUserId || !activityId || isLiking) return;

        setIsLiking(true);
        const previousLikes = [...likes];

        // Optimistic update
        setLikes((prev) =>
          isLiked
            ? prev.filter((id) => id !== currentUserId)
            : [...prev, currentUserId]
        );

        const result = await onLikeToggle(activityId, profileId);
        if (result === null) {
          setLikes(previousLikes);
        } else {
          setLikes(result);
        }
        setIsLiking(false);
      },
      [
        currentUserId,
        activity.activityId,
        isLiking,
        isLiked,
        likes,
        onLikeToggle,
        profileId,
      ]
    );

    return (
      <MotionBox
        // Visible desde el principio: la cascada por índice no tenía tope
        initial={false}
        role="article"
        onClick={handleCardClick}
        sx={{
          p: 2,
          mb: 1.5,
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          cursor: activity.bookId ? 'pointer' : 'default',
          transition: 'background-color 0.2s, border-color 0.2s',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(147, 51, 234, 0.25)',
          },
        }}
      >
        <BookCover
          imageUrl={bookImage}
          bookId={activity.bookId || ''}
          onLoad={onImageLoad}
        />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-start',
            textAlign: 'left',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 0.75,
            }}
          >
            <ActivityIconComponent
              sx={{
                fontSize: 14,
                color: activityColor,
              }}
            />
            {activity.formattedDate && (
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: lora.style.fontFamily,
                  fontSize: 12.5,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {activity.formattedDate}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.92)',
              fontFamily: lora.style.fontFamily,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {displayMessage}
          </Typography>

          {/* Badges y likes en una fila */}
          {(progress !== null ||
            rating !== null ||
            likes.length > 0 ||
            !!activity.activityId) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 0.5,
                width: '100%',
              }}
            >
              {progress !== null && <ProgressBadge progress={progress} />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {rating !== null && <RatingBadge rating={rating} />}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    ml: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    size="small"
                    onClick={handleLike}
                    disabled={
                      !currentUserId || !activity.activityId || isLiking
                    }
                    aria-label={isLiked ? 'Unlike activity' : 'Like activity'}
                    sx={{
                      p: 0.5,
                      color: showFilled(isLiked)
                        ? '#e74c6f'
                        : 'rgba(255,255,255,0.35)',
                      transition: 'color 0.15s ease, transform 0.15s ease',
                      '&:hover': {
                        color: '#e74c6f',
                        transform: 'scale(1.15)',
                        background: 'transparent',
                      },
                      '&.Mui-disabled': {
                        color: showFilled(isLiked)
                          ? '#e74c6f'
                          : 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    {showFilled(isLiked) ? (
                      <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                  {likes.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: showFilled(isLiked)
                          ? '#e74c6f'
                          : 'rgba(255,255,255,0.5)',
                        fontWeight: 600,
                        fontFamily: lora.style.fontFamily,
                        transition: 'color 0.15s ease',
                        minWidth: '1ch',
                      }}
                    >
                      {likes.length}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </MotionBox>
    );
  }
);

// Separador de mes, como en la app: línea — OCTUBRE 2026 — línea
const MonthSeparator: React.FC<{ label: string }> = React.memo(({ label }) => (
  <Box
    role="separator"
    aria-label={label}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mt: 3,
      mb: 1.5,
      '&:first-of-type': { mt: 0 },
      '&::before, &::after': {
        content: '""',
        flex: 1,
        height: '1px',
        background: 'rgba(255, 255, 255, 0.08)',
      },
    }}
  >
    <Typography
      component="span"
      sx={{
        fontFamily: lora.style.fontFamily,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.42)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Typography>
  </Box>
));

// Skeleton Loading Component — mismas medidas que ActivityItem
const SKELETON_BG = { bgcolor: 'rgba(255, 255, 255, 0.06)' };
const SkeletonActivityItem: React.FC = React.memo(() => (
  <Box
    sx={{
      p: 2,
      mb: 1.5,
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '18px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
    }}
  >
    <Skeleton
      variant="rectangular"
      width={72}
      height={108}
      sx={{ ...SKELETON_BG, borderRadius: '8px', flexShrink: 0 }}
    />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Skeleton variant="circular" width={14} height={14} sx={SKELETON_BG} />
        <Skeleton variant="text" width={80} height={18} sx={SKELETON_BG} />
      </Box>
      <Skeleton variant="text" width="95%" height={22} sx={SKELETON_BG} />
      <Skeleton variant="text" width="70%" height={22} sx={SKELETON_BG} />
      <Box sx={{ mt: 0.5 }}>
        <Skeleton variant="text" width={34} height={18} sx={SKELETON_BG} />
        <Skeleton
          variant="rounded"
          height={5}
          sx={{ ...SKELETON_BG, borderRadius: 999, mt: 0.5 }}
        />
      </Box>
    </Box>
  </Box>
));

// Separador de mes en carga
const SkeletonMonthSeparator: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: 1.5,
      '&::before, &::after': {
        content: '""',
        flex: 1,
        height: '1px',
        background: 'rgba(255, 255, 255, 0.08)',
      },
    }}
  >
    <Skeleton variant="text" width={110} height={18} sx={SKELETON_BG} />
  </Box>
);

// Empty State Component
const EmptyState: React.FC = React.memo(() => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #9333ea, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        🕐
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
          }}
        >
          {t('activity.empty.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#AAAAAA',
            fontFamily: lora.style.fontFamily,
          }}
        >
          {t('activity.empty.subtitle')}
        </Typography>
      </Box>
    </Box>
  );
});
// Main Component
const ActivityTab: React.FC<ActivityTabProps> = ({ id }) => {
  const { user } = useGyCodingUser();
  const { toggleLike } = useActivityLike();
  const { data: activities, isLoading } = useActivities(id);
  const { data: books } = useHardcoverBatch(
    (activities
      ?.map((a: { bookId: any }) => a.bookId)
      .filter(Boolean) as string[]) || []
  );
  // Read-only: no fetch triggered here to avoid fighting with useProfilePage's useLibrary(friendId).
  const { books: cachedBooks, userId: cachedLibraryUserId } = useAppSelector(
    (s) => s.library
  );
  const [loadedCount, setLoadedCount] = useState(0);

  // User edition cover overrides from library
  const userCoverMap = useMemo(() => {
    const map = new Map<string, string>();
    const libraryBooks = cachedLibraryUserId === user?.id ? cachedBooks : [];
    libraryBooks?.forEach((book) => {
      map.set(String(book.id), BookHelpers.getDisplayCoverUrl(book));
    });
    return map;
  }, [cachedBooks, cachedLibraryUserId, user?.id]);

  // Crear un mapa de bookId -> imagen para acceso rápido
  const booksMap = useMemo(() => {
    if (!books) return new Map<string, string>();
    return new Map(
      books.map((book: HardcoverBook) => [
        String(book.id),
        userCoverMap.get(String(book.id)) ??
          book.cover?.url ??
          '/placeholder-book.png',
      ])
    );
  }, [books, userCoverMap]);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // Agrupar por meses, como en la app ("OCTUBRE 2026")
  const { locale } = useTranslation();
  const monthKey = (a?: ActivityEntry) => {
    if (!a?.date) return '';
    const d = new Date(a.date);
    return `${d.getFullYear()}-${d.getMonth()}`;
  };
  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || 'es', {
        month: 'long',
        year: 'numeric',
      }),
    [locale]
  );
  const monthLabel = (date: Date | string) =>
    monthFormatter.format(new Date(date));

  // Show skeleton only while initial loading
  const showSkeleton = isLoading;

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: lora.style.fontFamily,
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ maxWidth: 880, mx: 'auto', px: 1 }}>
              <SkeletonMonthSeparator />
              {[...Array(5)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </Box>
          </motion.div>
        ) : activities && activities.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ maxWidth: 880, mx: 'auto', px: 1 }}>
              {activities.map((activity: ActivityEntry, index: number) => (
                <React.Fragment
                  key={`${activity.bookId || 'activity'}-${index}-${activity.date ? new Date(activity.date).getTime() : index}`}
                >
                  {monthKey(activities[index - 1]) !== monthKey(activity) &&
                    activity.date && (
                      <MonthSeparator label={monthLabel(activity.date)} />
                    )}
                  <ActivityItem
                    activity={activity}
                    index={index}
                    bookImage={
                      activity.bookId
                        ? booksMap.get(activity.bookId) || null
                        : null
                    }
                    onImageLoad={handleImageLoad}
                    currentUserId={
                      user?.id !== String(id) ? user?.id : undefined
                    }
                    isOwnActivity={!!user?.id && user.id === String(id)}
                    profileId={String(id)}
                    onLikeToggle={toggleLike}
                  />
                </React.Fragment>
              ))}
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ActivityTab;
