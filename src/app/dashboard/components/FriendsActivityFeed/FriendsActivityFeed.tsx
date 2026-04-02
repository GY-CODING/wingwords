/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ActivityBadges } from '@/app/components/atoms/ActivityCard/components/ActivityBadges';
import { ActivityIcon } from '@/app/components/atoms/ActivityCard/components/ActivityIcon';
import { UserAvatar } from '@/app/components/atoms/UserAvatar';
import {
  ActivityType,
  getActivityColor,
  getActivityType,
} from '@/domain/activity.model';
import { useActivityLike } from '@/hooks/activities/useActivityLike';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import {
  formatRelativeDateI18n,
  translateActivityMessage,
} from '@/hooks/activities/utils/activityHelpers';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import { AutoStories } from '@mui/icons-material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const MotionBox = motion(Box);

const MotionIconButton = motion(IconButton);

/**
 * Item individual de actividad de amigo.
 * Memoizado para evitar re-renders de toda la lista cuando cambia una sola actividad.
 */
const FriendActivityItem = React.memo<{
  activity: any;
  bookCoverUrl?: string;
  index: number;
  currentUserId?: string;
  onActivityClick: (bookId?: string) => void;
  onUserClick: (userId: string) => void;
  onLikeToggle: (
    activityId: string,
    profileId: string
  ) => Promise<string[] | null>;
}>(
  ({
    activity,
    index,
    currentUserId,
    onActivityClick,
    onUserClick,
    onLikeToggle,
  }) => {
    const { t, locale } = useTranslation();
    const activityType = getActivityType(activity.message);
    const activityColor = getActivityColor(activityType);
    const activityLabelMap: Record<ActivityType, string> = {
      [ActivityType.STARTED]: t('dashboard.activity.started'),
      [ActivityType.FINISHED]: t('dashboard.activity.finished'),
      [ActivityType.RATED]: t('dashboard.activity.rated'),
      [ActivityType.PROGRESS]: t('dashboard.activity.progress'),
      [ActivityType.WANT_TO_READ]: t('dashboard.activity.wantToRead'),
      [ActivityType.REVIEWED]: t('dashboard.activity.reviewed'),
      [ActivityType.OTHER]: t('dashboard.activity.other'),
    };
    const activityLabel =
      activityLabelMap[activityType] || t('dashboard.activity.other');

    // Optimistic likes state — initialized from real server data
    const [likes, setLikes] = useState<string[]>(activity.likes ?? []);
    const [isLiking, setIsLiking] = useState(false);

    const isLiked = useMemo(
      () => (currentUserId ? likes.includes(currentUserId) : false),
      [likes, currentUserId]
    );

    const handleLike = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUserId || !activity.activityId || isLiking) return;

        setIsLiking(true);
        const previousLikes = [...likes];

        // Optimistic update
        if (isLiked) {
          setLikes((prev) => prev.filter((id) => id !== currentUserId));
        } else {
          setLikes((prev) => [...prev, currentUserId]);
        }

        const result = await onLikeToggle(
          activity.activityId,
          activity.profileId
        );

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
        activity.profileId,
        isLiking,
        likes,
        isLiked,
        onLikeToggle,
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
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Header: Friend Info + Activity Type */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5,
            cursor:
              activity.userId || activity.profileId ? 'pointer' : 'default',
            borderRadius: 2,
            p: 0.5,
            mx: -0.5,
            transition: 'background 0.15s ease',
            '&:hover':
              activity.userId || activity.profileId
                ? { background: 'rgba(255, 255, 255, 0.04)' }
                : {},
          }}
          onClick={(e) => {
            e.stopPropagation();
            const id = activity.userId || activity.profileId;
            if (id) onUserClick(id);
          }}
        >
          {activity.username === null ? (
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              animation="wave"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
          ) : (
            <UserAvatar
              src={activity.userPicture}
              alt={activity.username}
              size={32}
              sx={{
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
              }}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Username con skeleton si está cargando */}
            {!activity.username ? (
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  mb: 0.3,
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.2,
                }}
              >
                {activity.username}
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: lora.style.fontFamily,
              }}
            >
              {formatRelativeDateI18n(activity.date, locale)}
            </Typography>
          </Box>

          {/* Activity Type Icon */}
          <ActivityIcon type={activityType} size={20} />
        </Box>

        {/* Activity Type Label */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            background: `${activityColor}25`,
            border: `1px solid ${activityColor}40`,
            mb: 1,
          }}
        >
          <ActivityIcon type={activityType} size={14} />
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: activityColor,
              fontFamily: lora.style.fontFamily,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {activityLabel}
          </Typography>
        </Box>

        {/* Activity Message */}
        <Typography
          onClick={() => onActivityClick(activity.bookId)}
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.6,
            mb: 1.5,
            cursor: activity.bookId ? 'pointer' : 'default',
            transition: 'color 0.15s ease',
            '&:hover': activity.bookId ? { color: '#c084fc' } : {},
          }}
        >
          {translateActivityMessage(activity.message, t)}
        </Typography>

        {/* Activity Badges */}
        <ActivityBadges activity={activity} />

        {/* Like button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
          }}
        >
          <MotionIconButton
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
            whileTap={{ scale: 1.3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            sx={{
              p: 0.5,
              color: isLiked ? '#e74c6f' : 'rgba(255, 255, 255, 0.25)',
              '&:hover': {
                background: 'rgba(231, 76, 111, 0.08)',
                color: isLiked ? '#e74c6f' : 'rgba(255, 255, 255, 0.5)',
              },
            }}
            size="small"
          >
            {isLiked ? (
              <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </MotionIconButton>

          {likes.length > 0 && (
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: isLiked ? '#e74c6f' : 'rgba(255, 255, 255, 0.35)',
                fontWeight: 500,
              }}
            >
              {likes.length}
            </Typography>
          )}
        </Box>
      </MotionBox>
    );
  }
);

FriendActivityItem.displayName = 'FriendActivityItem';

const SkeletonItem: React.FC = () => (
  <Box
    sx={{
      mb: 2,
      p: 2,
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }}
  >
    {/* Header: Avatar + Info + Icon */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 1.5,
      }}
    >
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width={100}
          height={16}
          sx={{ mb: 0.5, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />
        <Skeleton
          variant="text"
          width={70}
          height={14}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />
      </Box>
      <Skeleton
        variant="circular"
        width={28}
        height={28}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
    </Box>

    {/* Activity Type Label */}
    <Skeleton
      variant="text"
      width={120}
      height={14}
      sx={{ mb: 0.5, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
    />

    {/* Message */}
    <Skeleton
      variant="text"
      width="100%"
      height={16}
      sx={{ mb: 0.5, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
    />
    <Skeleton
      variant="text"
      width="80%"
      height={16}
      sx={{ mb: 1.5, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
    />

    {/* Badges */}
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton
        variant="rounded"
        width={60}
        height={24}
        sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
    </Box>
  </Box>
);

const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(147, 51, 234, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <AutoStories sx={{ fontSize: 40, color: 'rgba(147, 51, 234, 0.4)' }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: lora.style.fontFamily,
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 1,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        {t('dashboard.activity.empty')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: lora.style.fontFamily,
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.9rem',
          maxWidth: 300,
        }}
      >
        {t('dashboard.activity.emptyHint')}
      </Typography>
    </Box>
  );
};

interface FriendsActivityFeedProps {
  activities: FriendActivity[];
  isLoading: boolean;
  currentUserId?: string;
  loadMore?: () => void;
  hasNext?: boolean;
  isLoadingMore?: boolean;
}

/**
 * Feed de actividades de amigos.
 * Memoizado para evitar re-renders cuando cambian datos no relacionados del dashboard.
 */
export const FriendsActivityFeed = React.memo<FriendsActivityFeedProps>(
  ({
    activities,
    isLoading,
    currentUserId,
    loadMore,
    hasNext,
    isLoadingMore,
  }) => {
    const router = useRouter();
    const { toggleLike } = useActivityLike();

    const handleActivityClick = React.useCallback(
      (bookId?: string) => {
        if (bookId) {
          router.push(`/books/${bookId}`);
        }
      },
      [router]
    );

    const handleUserClick = React.useCallback(
      (userId: string) => {
        router.push(`/users/${userId}`);
      },
      [router]
    );

    const handleLikeToggle = React.useCallback(
      async (
        activityId: string,
        profileId: string
      ): Promise<string[] | null> => {
        return toggleLike(activityId, profileId);
      },
      [toggleLike]
    );

    // Infinite scroll sentinel
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!sentinelRef.current || !loadMore) return;

      const root = sentinelRef.current.parentElement || null;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasNext) {
              loadMore();
            }
          });
        },
        {
          root,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );

      obs.observe(sentinelRef.current);

      return () => {
        obs.disconnect();
      };
    }, [loadMore, hasNext]);

    // Loading state
    if (isLoading) {
      return (
        <Box>
          {[1, 2, 3].map((i) => (
            <SkeletonItem key={i} />
          ))}
        </Box>
      );
    }

    // Empty state
    if (!activities || activities.length === 0) {
      return <EmptyState />;
    }

    // Content
    return (
      <>
        <AnimatePresence>
          {activities.map((activity, index) => (
            <FriendActivityItem
              key={`${activity.userId}-${activity.date}-${index}`}
              activity={activity}
              index={index}
              currentUserId={currentUserId}
              onActivityClick={handleActivityClick}
              onUserClick={handleUserClick}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </AnimatePresence>
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} />
        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Loading more...
            </Typography>
          </Box>
        )}
      </>
    );
  }
);

FriendsActivityFeed.displayName = 'FriendsActivityFeed';
