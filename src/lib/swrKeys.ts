/**
 * Centralized SWR cache key constants and factories.
 * Always use these to avoid key string duplication across hooks.
 */
export const SWR_KEYS = {
  lists: '/api/auth/lists',
  list: (id: string) => `/api/auth/lists/${id}`,
  hallOfFame: (userId: string) => `/api/public/accounts/halloffame/${userId}`,
  activities: (userId: string) =>
    `/api/public/books/activities?userId=${userId}`,
  stats: (id: string) => `/api/public/accounts/${id}/books/stats`,
  book: (id: string) => `/api/books/${id}`,
} as const;
