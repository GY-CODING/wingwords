export const SWR_KEYS = {
  user: '/api/auth/get',
  lists: '/api/auth/lists',
  list: (id: string) => `/api/auth/lists/${id}`,
  friends: '/api/auth/users/accounts/friends',
  myActivities: '/api/auth/books/activity',
  hallOfFame: (userId: string) => `/api/public/accounts/halloffame/${userId}`,
  activities: (userId: string) =>
    `/api/public/books/activities?userId=${userId}`,
  stats: (id: string) => `/api/public/accounts/${id}/books/stats`,
  accountsUser: (id: string) => `/api/accounts/users/${id}`,
  book: (id: string) => `/api/books/${id}`,
} as const;
