/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Box, Container } from '@mui/material';
import React from 'react';
import { BooksTab } from '../BooksTab/BooksTab';
import { CompactBooksFilter } from '../BooksFilter/CompactBooksFilter';
import { ProfileHeader } from '../ProfileHeader/ProfileHeader';
import { ProfileNavigation } from '../ProfileNavigation/ProfileNavigation';
import { ProfileTabContent } from '../ProfileTabContent/ProfileTabContent';
import type {
  ProfileUser,
  ProfileFilters,
  ProfileFiltersActions,
  ProfileFilterOptions,
  ViewType,
} from '../../utils/profileTypes';
import type { UserProfileBook } from '@/domain/user.model';

export interface ProfileEditProps {
  friendsCount: number;
  isLoadingFriends: boolean;
  biography: string;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  onBiographyChange: (bio: string) => void;
  onBiographySave: () => void;
  onBiographyCancel: () => void;
  onEditProfile: () => void;
  onImportGoodreads?: () => void;
}

export interface ProfileVisitorProps {
  isFriend: boolean;
  isAddingFriend: boolean;
  isRemovingFriend: boolean;
  onAddFriend: () => void;
  onRemoveFriend: () => void;
}

interface ProfileLayoutProps {
  user: ProfileUser;
  basePath: string;
  books: UserProfileBook[];
  booksLoading: boolean;
  hasMore: boolean;
  filters: ProfileFilters & ProfileFiltersActions;
  filterOptions: ProfileFilterOptions;
  filteredBooks: UserProfileBook[];
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  tab: number;
  onTabChange: (tab: number) => void;
  editProps?: ProfileEditProps;
  visitorProps?: ProfileVisitorProps;
}

const noop = () => {};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  user,
  basePath,
  books,
  booksLoading,
  hasMore,
  filters,
  filterOptions,
  filteredBooks,
  view,
  onViewChange,
  tab,
  onTabChange,
  editProps,
  visitorProps,
}) => {
  const isOwnProfile = !!editProps;
  const hallOfFameCount = books.filter(
    (b) => (b.userData as any)?.hallOfFame
  ).length;

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 0 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 64px)',
        height: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        paddingTop: { xs: 2, md: 4 },
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <ProfileHeader
          user={user}
          books={books}
          isLoadingBooks={booksLoading}
          canEdit={isOwnProfile}
          friendsCount={editProps?.friendsCount ?? 0}
          isLoadingFriends={editProps?.isLoadingFriends ?? false}
          biography={editProps?.biography ?? user.biography ?? ''}
          isEditingBiography={editProps?.isEditingBiography ?? false}
          isLoadingBiography={editProps?.isLoadingBiography ?? false}
          onEditProfile={editProps?.onEditProfile ?? noop}
          onBiographyChange={editProps?.onBiographyChange ?? noop}
          onBiographySave={editProps?.onBiographySave ?? noop}
          onBiographyCancel={editProps?.onBiographyCancel ?? noop}
          onImportGoodreads={editProps?.onImportGoodreads}
          isFriend={visitorProps?.isFriend}
          isAddingFriend={visitorProps?.isAddingFriend}
          isRemovingFriend={visitorProps?.isRemovingFriend}
          onAddFriend={visitorProps?.onAddFriend}
          onRemoveFriend={visitorProps?.onRemoveFriend}
        />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            mt: 0,
            minHeight: 0,
          }}
        >
          <ProfileNavigation
            activeTab={tab}
            onTabChange={onTabChange}
            booksCount={books.length}
            hallOfFameCount={hallOfFameCount}
            basePath={basePath}
            isOwnProfile={isOwnProfile}
          >
            {tab === 0 && (
              <CompactBooksFilter
                statusOptions={filterOptions.statusOptions}
                statusFilter={filters.status}
                authorOptions={filterOptions.authorOptions}
                seriesOptions={filterOptions.seriesOptions}
                authorFilter={filters.author}
                seriesFilter={filters.series}
                ratingFilter={filters.rating}
                search={filters.search}
                onStatusChange={filters.handleStatusFilterChange}
                onAuthorChange={filters.handleAuthorFilterChange}
                onSeriesChange={filters.handleSeriesFilterChange}
                onRatingChange={filters.handleRatingFilterChange}
                onSearchChange={filters.handleSearchChange}
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onOrderByChange={filters.handleOrderByChange}
                onOrderDirectionChange={filters.handleOrderDirectionChange}
                view={view}
                onViewChange={onViewChange}
                isOwnProfile={isOwnProfile}
              />
            )}
          </ProfileNavigation>

          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ProfileTabContent
              tab={tab}
              userId={user.id as string}
              books={books}
              booksLoading={booksLoading}
              isOwnProfile={isOwnProfile}
            >
              <BooksTab
                books={books}
                filteredBooks={filteredBooks}
                loading={booksLoading}
                hasMore={hasMore}
                filterOptions={filterOptions}
                filters={filters}
                view={view}
                onViewChange={onViewChange}
              />
            </ProfileTabContent>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
