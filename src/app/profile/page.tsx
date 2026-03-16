'use client';

import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { User } from '@/domain/user.model';
import { useFriends } from '@/hooks/useFriends';
import { RootState } from '@/store';
import { ESeverity } from '@/utils/constants/ESeverity';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { ProfileLayout } from './components/ProfileLayout/ProfileLayout';
import { ProfilePageSkeleton } from './components/ProfilePageSkeleton';
import { useProfileBiography } from './hooks/useProfileBiography';
import { useProfilePage } from './hooks/useProfilePage';
import AIRecommendationsPanel from '@/app/components/organisms/AIRecommendationsPanel/AIRecommendationsPanel';

function ProfilePageContent() {
  const user = useSelector(
    (state: RootState) => state.user.profile
  ) as User | null;
  const profilePage = useProfilePage({
    userId: user?.id ?? '',
    basePath: '/profile',
  });
  const { count: friendsCount, isLoading: isLoadingFriends } = useFriends();
  const biography = useProfileBiography(user);

  if (!user) return <ProfilePageSkeleton />;

  return (
    <>
      <ProfileLayout
        user={user}
        basePath="/profile"
        {...profilePage}
        editProps={{
          friendsCount,
          isLoadingFriends,
          biography: biography.biography,
          isEditingBiography: biography.isEditingBiography,
          isLoadingBiography: biography.isLoadingBiography,
          onBiographyChange: biography.handleBiographyChange,
          onBiographySave: biography.handleBiographySave,
          onBiographyCancel: biography.handleCancelBiography,
          onEditProfile: biography.handleEditBiography,
        }}
      />
      <AnimatedAlert
        open={biography.isUpdatedBiography}
        onClose={() => biography.setIsUpdatedBiography(false)}
        message="Biography updated successfully"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={biography.isErrorBiography}
        onClose={() => biography.setIsErrorBiography(false)}
        message="Error updating biography"
        severity={ESeverity.ERROR}
      />
      <AIRecommendationsPanel
        mode="discover"
        currentUserId={user.id}
        currentUser={user}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
