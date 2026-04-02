'use client';

import { useActivityLike } from '@/hooks/activities/useActivityLike';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { Box, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import {
  FriendActivityMobileItem,
  FriendActivityMobileItemSkeleton,
} from './FriendActivityMobileItem';

interface FriendsActivityMobileFeedProps {
  activities: FriendActivity[];
  isLoading: boolean;
  currentUserId?: string;
}

/**
 * Empty state minimalista para el feed móvil.
 */
const EmptyStateMobile: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(147, 51, 234, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <AutoStoriesRoundedIcon
          sx={{ fontSize: 28, color: 'rgba(147, 51, 234, 0.4)' }}
        />
      </Box>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.5)',
          mb: 0.5,
        }}
      >
        {t('dashboard.activity.emptyMobile')}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.3)',
          maxWidth: 240,
        }}
      >
        {t('dashboard.activity.emptyMobileHint')}
      </Typography>
    </Box>
  );
};

/**
 * Feed de actividades de amigos para mobile.
 * Layout vertical con items compactos, likes, y animaciones suaves.
 */
export const FriendsActivityMobileFeed =
  React.memo<FriendsActivityMobileFeedProps>(
    ({ activities, isLoading, currentUserId }) => {
      const router = useRouter();
      const { toggleLike } = useActivityLike();

      const handleActivityClick = useCallback(
        (bookId?: string) => {
          if (bookId) {
            router.push(`/books/${bookId}`);
          }
        },
        [router]
      );

      const handleUserClick = useCallback(
        (userId: string) => {
          router.push(`/users/${userId}`);
        },
        [router]
      );

      const handleLikeToggle = useCallback(
        async (
          activityId: string,
          activityAuthorProfileId: string
        ): Promise<string[] | null> => {
          return toggleLike(activityId, activityAuthorProfileId);
        },
        [toggleLike]
      );

      if (isLoading) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3, 4].map((i) => (
              <FriendActivityMobileItemSkeleton key={i} />
            ))}
          </Box>
        );
      }

      if (!activities || activities.length === 0) {
        return <EmptyStateMobile />;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            maxHeight: '500px',
            height: '47vh',
            overflow: 'auto',
          }}
        >
          <AnimatePresence>
            {activities.map((activity, index) => (
              <FriendActivityMobileItem
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
        </Box>
      );
    }
  );

FriendsActivityMobileFeed.displayName = 'FriendsActivityMobileFeed';
