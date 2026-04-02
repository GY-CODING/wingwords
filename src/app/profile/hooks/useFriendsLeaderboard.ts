'use client';

import { useFriends } from '@/hooks/useFriends';
import { Friend } from '@/domain/friend.model';
import { User } from '@/domain/user.model';
import useSWR from 'swr';
import { useMemo } from 'react';

export interface LeaderboardEntry {
  id: string;
  username: string;
  picture: string;
  booksReadThisYear: number;
  totalBooks: number;
  totalPages: number;
  reviewedBooks: number;
  averageRating: number;
  isCurrentUser: boolean;
}

export type LeaderboardMetric =
  | 'year'
  | 'total'
  | 'pages'
  | 'reviews'
  | 'rating';

export interface MetricConfig {
  key: LeaderboardMetric;
  label: string;
  getValue: (e: LeaderboardEntry) => number;
  format: (v: number) => string;
  color: string;
}

export const LEADERBOARD_METRICS: MetricConfig[] = [
  {
    key: 'year',
    label: `Books ${new Date().getFullYear()}`,
    getValue: (e) => e.booksReadThisYear,
    format: (v) => `${v}`,
    color: '#a855f7',
  },
  {
    key: 'total',
    label: 'All time',
    getValue: (e) => e.totalBooks,
    format: (v) => `${v}`,
    color: '#60a5fa',
  },
  {
    key: 'pages',
    label: 'Pages read',
    getValue: (e) => e.totalPages,
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`),
    color: '#34d399',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    getValue: (e) => e.reviewedBooks,
    format: (v) => `${v}`,
    color: '#f59e0b',
  },
  {
    key: 'rating',
    label: 'Avg rating',
    getValue: (e) => e.averageRating,
    format: (v) => (v > 0 ? `${v.toFixed(1)}★` : '—'),
    color: '#fb923c',
  },
];

interface UseFriendsLeaderboardReturn {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

async function fetchFriendStats(
  friendId: string
): Promise<
  Omit<LeaderboardEntry, 'id' | 'username' | 'picture' | 'isCurrentUser'>
> {
  const res = await fetch(`/api/public/accounts/${friendId}/books/stats`);
  if (!res.ok) {
    return {
      booksReadThisYear: 0,
      totalBooks: 0,
      totalPages: 0,
      reviewedBooks: 0,
      averageRating: 0,
    };
  }
  const data = await res.json();
  return {
    booksReadThisYear: data?.booksReadThisYear ?? 0,
    totalBooks: data?.totalBooks ?? 0,
    totalPages: data?.totalPages ?? 0,
    reviewedBooks: data?.reviewedBooks ?? 0,
    averageRating: data?.ratings?.averageRating ?? 0,
  };
}

async function fetchAllFriendsStats(
  friends: Friend[],
  currentUser: User | null
): Promise<LeaderboardEntry[]> {
  const participants = [
    ...(currentUser
      ? [
          {
            id: currentUser.id as string,
            username: currentUser.username,
            picture: currentUser.picture,
            isCurrentUser: true,
          },
        ]
      : []),
    ...friends.map((f) => ({
      id: f.id as string,
      username: f.username,
      picture: f.picture,
      isCurrentUser: false,
    })),
  ];

  const results = await Promise.allSettled(
    participants.map((p) => fetchFriendStats(p.id))
  );

  return participants.map((p, i) => {
    const stats =
      results[i].status === 'fulfilled'
        ? (
            results[i] as PromiseFulfilledResult<
              Omit<
                LeaderboardEntry,
                'id' | 'username' | 'picture' | 'isCurrentUser'
              >
            >
          ).value
        : {
            booksReadThisYear: 0,
            totalBooks: 0,
            totalPages: 0,
            reviewedBooks: 0,
            averageRating: 0,
          };
    return { ...p, ...stats };
  });
}

export function useFriendsLeaderboard(
  currentUser: User | null
): UseFriendsLeaderboardReturn {
  const { data: friends, isLoading: isLoadingFriends } = useFriends();

  const cacheKey = useMemo(() => {
    if (!friends || isLoadingFriends) return null;
    const ids = [currentUser?.id ?? '', ...friends.map((f) => f.id)].join(',');
    return `leaderboard:${ids}`;
  }, [friends, isLoadingFriends, currentUser?.id]);

  const { data, isLoading: isLoadingStats } = useSWR(
    cacheKey,
    () => fetchAllFriendsStats(friends ?? [], currentUser),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300_000,
      shouldRetryOnError: false,
    }
  );

  return {
    entries: data ?? [],
    isLoading: isLoadingFriends || isLoadingStats,
  };
}
