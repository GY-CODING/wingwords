import { EBookStatus } from '@gycoding/nebula';
import { UUID } from 'crypto';

export type ViewType = 'grid' | 'list' | 'timeline' | 'calendar';

export interface ProfileUser {
  id: UUID | string;
  username: string;
  picture: string;
  biography?: string | null;
}

export interface ProfileFilters {
  status: EBookStatus | null;
  author: string;
  series: string;
  rating: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface ProfileFilterOptions {
  statusOptions: Array<{ label: string; value: EBookStatus }>;
  authorOptions: string[];
  seriesOptions: string[];
}

export interface ProfileFiltersActions {
  handleStatusFilterChange: (status: EBookStatus | null) => void;
  handleAuthorFilterChange: (author: string) => void;
  handleSeriesFilterChange: (series: string) => void;
  handleRatingFilterChange: (rating: number) => void;
  handleSearchChange: (search: string) => void;
  handleOrderByChange: (orderBy: string) => void;
  handleOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}
