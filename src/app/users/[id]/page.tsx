'use client';

import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileLayout } from '@/app/profile/components/ProfileLayout/ProfileLayout';
import { useProfilePage } from '@/app/profile/hooks/useProfilePage';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { Box, Container, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { UserProfileSkeleton } from './components/UserProfileSkeleton/UserProfileSkeleton';
import { useAddFriend } from './hooks/useAddFriend';
import AIRecommendationsPanel from '@/app/components/organisms/AIRecommendationsPanel/AIRecommendationsPanel';
import { User } from '@/domain/user.model';

function UserProfileContent() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const { user: currentUser } = useGyCodingUser();
  const isOwnProfile = !!currentUser?.id && currentUser.id === userId;

  useEffect(() => {
    if (isOwnProfile) router.replace('/profile');
  }, [isOwnProfile, router]);
  const { data: user, isLoading } = useAccountsUser(userId);
  const profilePage = useProfilePage({ userId, basePath: `/users/${userId}` });
  const {
    isFriend,
    isAdding,
    isSuccess,
    isError,
    isRemoving,
    isRemoveSuccess,
    isRemoveError,
    handleAddFriend,
    handleRemoveFriend,
    setIsSuccess,
    setIsError,
    setIsRemoveSuccess,
    setIsRemoveError,
  } = useAddFriend(userId);

  if (isLoading) return <UserProfileSkeleton />;

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>User not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <ProfileLayout
        user={user}
        basePath={`/users/${userId}`}
        {...profilePage}
        {...(!isOwnProfile && {
          visitorProps: {
            isFriend,
            isAddingFriend: isAdding,
            isRemovingFriend: isRemoving,
            onAddFriend: handleAddFriend,
            onRemoveFriend: handleRemoveFriend,
          },
        })}
      />
      <AnimatedAlert
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        message="Friend request sent!"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isError}
        onClose={() => setIsError(false)}
        message="Could not send friend request. Try again."
        severity={ESeverity.ERROR}
      />
      <AnimatedAlert
        open={isRemoveSuccess}
        onClose={() => setIsRemoveSuccess(false)}
        message="Friend removed successfully."
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isRemoveError}
        onClose={() => setIsRemoveError(false)}
        message="Could not remove friend. Try again."
        severity={ESeverity.ERROR}
      />
      {!isOwnProfile && currentUser?.id && (
        <AIRecommendationsPanel
          mode="recommend"
          currentUserId={currentUser.id}
          currentUser={currentUser as User}
          targetUserId={userId}
          targetUser={user as unknown as User}
        />
      )}
    </>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  );
}
