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

// Progress Badge Component
const ProgressBadge: React.FC<{ progress: number }> = React.memo(
  ({ progress }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: '8px',
        background: 'rgba(147, 51, 234, 0.15)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        color: '#c084fc',
      }}
    >
      <BarChartIcon sx={{ fontSize: 14 }} />
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          fontFamily: lora.style.fontFamily,
        }}
      >
        {progress}%
      </Typography>
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
      borderRadius: '6px',
      background: 'rgba(147, 51, 234, 0.15)',
      color: '#c084fc',
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
        width: 70,
        height: 100,
        flexShrink: 0,
        borderRadius: 1,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1],
        }}
        role="article"
        onClick={handleCardClick}
        sx={{
          p: 1.5,
          mb: 2,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          cursor: activity.bookId ? 'pointer' : 'default',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
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
                  color: '#AAAAAA',
                  fontFamily: lora.style.fontFamily,
                  fontSize: 12,
                }}
              >
                {activity.formattedDate}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontSize: 14,
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
                alignItems: 'center',
                gap: 1.5,
                mt: 1,
              }}
            >
              {progress !== null && <ProgressBadge progress={progress} />}
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
                  disabled={!currentUserId || !activity.activityId || isLiking}
                  aria-label={isLiked ? 'Unlike activity' : 'Like activity'}
                  sx={{
                    p: 0.5,
                    color: isLiked ? '#e74c6f' : 'rgba(255,255,255,0.35)',
                    transition: 'color 0.15s ease, transform 0.15s ease',
                    '&:hover': {
                      color: '#e74c6f',
                      transform: 'scale(1.15)',
                      background: 'transparent',
                    },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  {isLiked ? (
                    <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
                {likes.length > 0 && (
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: isLiked ? '#e74c6f' : 'rgba(255,255,255,0.5)',
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
          )}
        </Box>
      </MotionBox>
    );
  }
);

// Skeleton Loading Component
const SkeletonActivityItem: React.FC = React.memo(() => (
  <Box
    sx={{
      p: 1.5,
      mb: 2,
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
    }}
  >
    <Skeleton
      variant="rectangular"
      width={70}
      height={100}
      sx={{ borderRadius: 1, flexShrink: 0 }}
    />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" width={80} height={12} />
      </Box>
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="80%" height={14} />
      <Skeleton
        variant="rectangular"
        width={60}
        height={24}
        sx={{ borderRadius: '6px' }}
      />
    </Box>
  </Box>
));

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
  const libraryBooks = cachedLibraryUserId === user?.id ? cachedBooks : [];
  const [loadedCount, setLoadedCount] = useState(0);

  // User edition cover overrides from library
  const userCoverMap = useMemo(() => {
    const map = new Map<string, string>();
    libraryBooks?.forEach((book) => {
      map.set(String(book.id), BookHelpers.getDisplayCoverUrl(book));
    });
    return map;
  }, [libraryBooks]);

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
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
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
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                px: 1,
                scrollbarColor: '#9333ea transparent',
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(147, 51, 234, 0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background:
                    'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                  borderRadius: 4,
                },
              }}
            >
              {activities.map((activity: ActivityEntry, index: number) => (
                <ActivityItem
                  key={`${activity.bookId || 'activity'}-${index}-${activity.date ? new Date(activity.date).getTime() : Date.now()}`}
                  activity={activity}
                  index={index}
                  bookImage={
                    activity.bookId
                      ? booksMap.get(activity.bookId) || null
                      : null
                  }
                  onImageLoad={handleImageLoad}
                  currentUserId={user?.id !== String(id) ? user?.id : undefined}
                  profileId={String(id)}
                  onLikeToggle={toggleLike}
                />
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
