'use client';

import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { User } from '@/domain/user.model';
import { useFriends } from '@/hooks/useFriends';
import { RootState } from '@/store';
import { ESeverity } from '@/utils/constants/ESeverity';
import { Suspense, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ProfileLayout } from './components/ProfileLayout/ProfileLayout';
import { ProfilePageSkeleton } from './components/ProfilePageSkeleton';
import { useProfileBiography } from './hooks/useProfileBiography';
import { useProfilePage } from './hooks/useProfilePage';
import AIRecommendationsPanel from '@/app/components/organisms/AIRecommendationsPanel/AIRecommendationsPanel';
import { GoodreadsImportModal } from './components/GoodreadsImport/GoodreadsImportModal';
import { useGoodreadsImport } from './hooks/useGoodreadsImport';
import { useHardcoverCsvImport } from './hooks/useHardcoverCsvImport';
import { useGoodreadsImportSave } from './hooks/useGoodreadsImportSave';
import { detectCsvFormat } from '@/utils/hardcoverParser';

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

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSource, setImportSource] = useState<'goodreads' | 'hardcover'>(
    'goodreads'
  );
  const goodreadsImport = useGoodreadsImport();
  const hardcoverCsvImport = useHardcoverCsvImport();
  const goodreadsImportSave = useGoodreadsImportSave();

  // The active import hook depends on which CSV format was detected
  const activeImport =
    importSource === 'hardcover' ? hardcoverCsvImport : goodreadsImport;

  const libraryBookIds = useMemo(
    () => new Set((profilePage.books ?? []).map((b) => b.id)),
    [profilePage.books]
  );

  const handleOpenImport = () => {
    setIsImportModalOpen(true);
    goodreadsImportSave.resetSave();
  };
  const handleCloseImport = () => {
    setIsImportModalOpen(false);
    setImportSource('goodreads');
    goodreadsImport.reset();
    hardcoverCsvImport.reset();
    goodreadsImportSave.resetSave();
  };
  const handleFileUpload = async (file: File) => {
    // Read just the first 600 bytes — enough to detect the header row
    const headerSlice = await file.slice(0, 600).text();
    const format = detectCsvFormat(headerSlice);
    const source = format === 'hardcover' ? 'hardcover' : 'goodreads';
    setImportSource(source);
    if (source === 'hardcover') {
      hardcoverCsvImport.handleFileUpload(file);
    } else {
      goodreadsImport.handleFileUpload(file);
    }
  };
  const handleImport = (
    selected: Parameters<typeof goodreadsImportSave.importBooks>[0]
  ) => {
    goodreadsImportSave.importBooks(selected, user?.username ?? '');
  };

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
          onImportGoodreads: handleOpenImport,
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
      <GoodreadsImportModal
        open={isImportModalOpen}
        onClose={handleCloseImport}
        status={activeImport.status}
        results={activeImport.results}
        progress={activeImport.progress}
        errorMessage={activeImport.errorMessage}
        shelfFilter={activeImport.shelfFilter}
        onShelfFilterChange={activeImport.setShelfFilter}
        onFileUpload={handleFileUpload}
        onSelectCandidate={activeImport.setSelectedCandidate}
        onToggleSkipped={activeImport.toggleSkipped}
        onReset={() => {
          activeImport.reset();
          setImportSource('goodreads');
        }}
        onImport={handleImport}
        saveStatus={goodreadsImportSave.saveStatus}
        saveProgress={goodreadsImportSave.saveProgress}
        saveError={goodreadsImportSave.saveError}
        libraryBookIds={libraryBookIds}
        importSource={importSource}
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
