'use client';

import useLibrary from '@/hooks/books/useLibrary';
import { useTranslation } from '@/hooks/useTranslation';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { ViewType } from '../utils/profileTypes';
import { ProfileBookHelpers } from '../utils/profileHelpers';
import { useProfileFilters } from './useProfileFilters';
import { useProfileTabs } from './useProfileTabs';
import type {
  ProfileFilters,
  ProfileFilterOptions,
  ProfileFiltersActions,
} from '../utils/profileTypes';
import type { UserProfileBook } from '@/domain/user.model';

interface UseProfilePageOptions {
  userId: string;
  basePath: string;
}

export interface UseProfilePageResult {
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
}

export function useProfilePage({
  userId,
  basePath,
}: UseProfilePageOptions): UseProfilePageResult {
  const searchParams = useSearchParams();
  const { tab, setTab } = useProfileTabs();
  const { t } = useTranslation();
  const [view, setView] = useState<ViewType>('grid');

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (
      viewParam &&
      ['grid', 'list', 'timeline', 'calendar'].includes(viewParam)
    ) {
      setView(viewParam as ViewType);
    }
  }, [searchParams]);

  const {
    data: books = [],
    isLoading: booksLoading,
    isDone,
  } = useLibrary(userId, 50);
  const filters = useProfileFilters(basePath);

  const filterOptions = useMemo(
    () => ProfileBookHelpers.generateFilterOptions(books, t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, t]
  );

  const filteredBooks = useMemo(() => {
    const filtered = ProfileBookHelpers.filterBooks(books, filters);
    return ProfileBookHelpers.sortBooks(
      filtered,
      filters.orderBy,
      filters.orderDirection
    );
  }, [books, filters]);

  return {
    books,
    booksLoading,
    hasMore: !isDone,
    filters,
    filterOptions,
    filteredBooks,
    view,
    onViewChange: setView,
    tab,
    onTabChange: setTab,
  };
}
