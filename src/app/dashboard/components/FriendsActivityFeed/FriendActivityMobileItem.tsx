'use client';

import { ActivityIcon } from '@/app/components/atoms/ActivityCard/components/ActivityIcon';
import { UserAvatar } from '@/app/components/atoms/UserAvatar';
import {
  ActivityType,
  getActivityColor,
  getActivityType,
} from '@/domain/activity.model';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import {
  formatRelativeDateI18n,
  translateActivityMessage,
} from '@/hooks/activities/utils/activityHelpers';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface FriendActivityMobileItemProps {
  activity: FriendActivity;
  index: number;
  currentUserId?: string;
  onActivityClick: (bookId?: string) => void;
  onUserClick: (userId: string) => void;
  onLikeToggle: (
    activityId: string,
    profileId: string
  ) => Promise<string[] | null>;
}

/**
 * Skeleton matching the mobile item layout.
 */
export const FriendActivityMobileItemSkeleton: React.FC = () => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="50%"
          height={16}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />
        <Skeleton
          variant="text"
          width="30%"
          height={12}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />
      </Box>
    </Box>
    <Skeleton
      variant="text"
      width="85%"
      height={16}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', mb: 0.5 }}
    />
    <Skeleton
      variant="text"
      width="60%"
      height={16}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
    />
  </Box>
);

/**
 * Item individual de actividad de amigo para mobile.
 * Diseño limpio y compacto con:
 * - Avatar + username + timestamp
 * - Activity type badge (color-coded chip sutil)
 * - Mensaje de la actividad
 * - Botón de like funcional con optimistic updates
 */
export const FriendActivityMobileItem =
  React.memo<FriendActivityMobileItemProps>(
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
        [ActivityType.STARTED]: t('dashboard.activity.startedShort'),
        [ActivityType.FINISHED]: t('dashboard.activity.finished'),
        [ActivityType.RATED]: t('dashboard.activity.rated'),
        [ActivityType.PROGRESS]: t('dashboard.activity.progressShort'),
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
            // Revert on error
            setLikes(previousLikes);
          } else {
            // Reconcile with server state
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
        ]
      );

      return (
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.04,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Header: Avatar + Username + Time + Activity Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              mb: 1.25,
              cursor:
                activity.userId || activity.profileId ? 'pointer' : 'default',
              WebkitTapHighlightColor: 'transparent',
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
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
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
              {!activity.username ? (
                <Skeleton
                  variant="text"
                  width="50%"
                  height={16}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.2,
                    }}
                  >
                    {activity.username}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    · {formatRelativeDateI18n(activity.date, locale)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Activity type mini icon */}
            <ActivityIcon type={activityType} size={16} />
          </Box>

          {/* Activity Type Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.3,
              borderRadius: 1.5,
              background: `${activityColor}12`,
              border: `1px solid ${activityColor}20`,
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: activityColor,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {activityLabel}
            </Typography>
          </Box>

          {/* Message */}
          <Typography
            onClick={() => onActivityClick(activity.bookId)}
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.5,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              cursor: activity.bookId ? 'pointer' : 'default',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.15s ease',
              '&:hover': activity.bookId ? { color: '#c084fc' } : {},
              '&:active': activity.bookId ? { color: '#c084fc' } : {},
            }}
          >
            {translateActivityMessage(activity.message, t)}
          </Typography>

          {/* Footer: Like button + count */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
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
                  background: 'transparent',
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
                  fontSize: '0.65rem',
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

FriendActivityMobileItem.displayName = 'FriendActivityMobileItem';
