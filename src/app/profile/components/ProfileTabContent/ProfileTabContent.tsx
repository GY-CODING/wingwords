import { lora } from '@/utils/fonts/fonts';
import { Box, CircularProgress } from '@mui/material';
import React, { Suspense } from 'react';
import { HallOfFameSkeleton } from '../../../components/molecules/HallOfFameSkeleton';
import StatsSkeleton from '../../../components/molecules/StatsSkeleton';
import { UserProfileBook } from '@/domain/user.model';
import { UUID } from 'crypto';

const Stats = React.lazy(() => import('../../../components/organisms/Stats'));
const HallOfFame = React.lazy(
  () => import('../../../components/molecules/HallOfFame')
);
const ActivityTab = React.lazy(
  () => import('../../../components/molecules/activityTab')
);
const ListsTab = React.lazy(() =>
  import('../ListsTab/ListsTab').then((m) => ({
    default: m.ListsTab,
  }))
);

interface ProfileTabContentProps {
  tab: number;
  userId: string;
  books: UserProfileBook[];
  booksLoading: boolean;
  isOwnProfile?: boolean;
  children?: React.ReactNode;
}

export function ProfileTabContent({
  tab,
  userId,
  books,
  booksLoading,
  isOwnProfile = false,
  children,
}: ProfileTabContentProps) {
  if (tab === 0 && children) {
    return <>{children}</>;
  }

  if (tab === 1) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#fff',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<HallOfFameSkeleton />}>
          <HallOfFame userId={userId} />
        </Suspense>
      </Box>
    );
  }

  if (tab === 2) {
    if (booksLoading) {
      return (
        <Box
          sx={{
            mt: 4,
            color: '#FFFFFF',
            fontFamily: lora.style.fontFamily,
            textAlign: 'center',
          }}
        >
          <StatsSkeleton />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          mt: 4,
          color: '#FFFFFF',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<StatsSkeleton />}>
          <Stats id={userId as UUID} books={books} booksLoading={false} />
        </Suspense>
      </Box>
    );
  }

  if (tab === 3) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#FFFFFF',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <ActivityTab id={userId as UUID} />
        </Suspense>
      </Box>
    );
  }

  if (tab === 4) {
    return (
      <Box sx={{ mt: 4 }}>
        <Suspense fallback={<CircularProgress />}>
          <ListsTab isOwnProfile={isOwnProfile} />
        </Suspense>
      </Box>
    );
  }

  return null;
}
