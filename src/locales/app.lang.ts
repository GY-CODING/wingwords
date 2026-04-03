import { defineMessages } from '@/lib/i18n/defineMessages';

/**
 * Archivo de mensajes único para toda la aplicación WingWords.
 * FUENTE DE VERDAD para todas las traducciones.
 *
 * Convenciones de nomenclatura de IDs:
 *   <sección>.<subsección>.<elemento>
 *   Ejemplo: landing.hero.subtitle, books.card.author
 *
 * Después de añadir o modificar claves:
 *   npm run i18n:compile   → genera/actualiza los .json y traduce automáticamente con IA
 *   npm run i18n:check     → verifica consistencia
 */
const appMessages = defineMessages({
  // ── Hero ─────────────────────────────────────────────────────────────────
  heroSubtitle: {
    id: 'landing.hero.subtitle',
    defaultMessage:
      'Track your reading journey, discover new books, curate your personal Hall of Fame, and connect with fellow readers worldwide.',
  },
  heroButtonExplore: {
    id: 'landing.hero.button.explore',
    defaultMessage: 'Explore Library',
  },
  heroButtonJoin: {
    id: 'landing.hero.button.join',
    defaultMessage: 'Join Community',
  },
  heroBadge: {
    id: 'landing.hero.badge',
    defaultMessage: "v1.1 • What's new",
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsBooksLabel: {
    id: 'landing.stats.books',
    defaultMessage: 'Books',
  },
  statsUpdatesValue: {
    id: 'landing.stats.updates.value',
    defaultMessage: 'Real-time',
  },
  statsUpdatesLabel: {
    id: 'landing.stats.updates',
    defaultMessage: 'Updates',
  },
  statsFeaturesLabel: {
    id: 'landing.stats.features',
    defaultMessage: 'Features',
  },

  // ── Features section ──────────────────────────────────────────────────────
  featuresSectionTitle: {
    id: 'landing.features.section.title',
    defaultMessage: 'Everything You Need to Read Better',
  },
  featuresSectionSubtitle: {
    id: 'landing.features.section.subtitle',
    defaultMessage:
      'All the features you need to track, discover, and share your reading journey',
  },

  // Feature cards
  featuresSmartLibraryTitle: {
    id: 'landing.features.smart-library.title',
    defaultMessage: 'Smart Library Management',
  },
  featuresSmartLibraryDescription: {
    id: 'landing.features.smart-library.description',
    defaultMessage:
      'Organize your books with custom filters: Want to Read, Reading, Read. Filter by ratings and track your progress effortlessly.',
  },
  featuresDiscoverTitle: {
    id: 'landing.features.discover.title',
    defaultMessage: 'Discover & Explore',
  },
  featuresDiscoverDescription: {
    id: 'landing.features.discover.description',
    defaultMessage:
      'Search through thousands of books, find detailed information, and browse multiple editions to pick your perfect cover.',
  },
  featuresSocialTitle: {
    id: 'landing.features.social.title',
    defaultMessage: 'Social Reading Network',
  },
  featuresSocialDescription: {
    id: 'landing.features.social.description',
    defaultMessage:
      'Search for readers, add friends, and follow their reading activities. See what your friends are reading in real-time.',
  },
  featuresHallOfFameTitle: {
    id: 'landing.features.hall-of-fame.title',
    defaultMessage: 'Hall of Fame',
  },
  featuresHallOfFameDescription: {
    id: 'landing.features.hall-of-fame.description',
    defaultMessage:
      'Curate your favorite books in a personal Hall of Fame and add your favorite quotes from each masterpiece.',
  },
  featuresEditionsTitle: {
    id: 'landing.features.editions.title',
    defaultMessage: 'Multiple Editions',
  },
  featuresEditionsDescription: {
    id: 'landing.features.editions.description',
    defaultMessage:
      'Choose from different book editions to customize your library with the cover art you love most.',
  },
  featuresActivityTitle: {
    id: 'landing.features.activity.title',
    defaultMessage: 'Activity Feed',
  },
  featuresActivityDescription: {
    id: 'landing.features.activity.description',
    defaultMessage:
      "Stay connected with your reading community. View your activity and your friends' reading progress and updates.",
  },

  // ── CTA section ───────────────────────────────────────────────────────────
  ctaTitle: {
    id: 'landing.cta.title',
    defaultMessage: 'Connect with Fellow Book Lovers',
  },
  ctaDescription: {
    id: 'landing.cta.description',
    defaultMessage:
      'Build meaningful connections with readers who share your literary interests. Follow their activities, exchange recommendations, and grow your reading community.',
  },
  ctaButton: {
    id: 'landing.cta.button',
    defaultMessage: 'Find Readers',
  },
  ctaFeaturesFollow: {
    id: 'landing.cta.features.follow',
    defaultMessage: 'Follow readers with similar tastes',
  },
  ctaFeaturesShare: {
    id: 'landing.cta.features.share',
    defaultMessage: 'Share your reading activity',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerDescription: {
    id: 'landing.footer.description',
    defaultMessage: 'Discover, share, and connect with other readers.',
  },
  footerAbout: {
    id: 'landing.footer.about',
    defaultMessage: 'About Us',
  },
  footerPrivacy: {
    id: 'landing.footer.privacy',
    defaultMessage: 'Privacy',
  },
  footerTerms: {
    id: 'landing.footer.terms',
    defaultMessage: 'Terms',
  },
  footerChangelog: {
    id: 'landing.footer.changelog',
    defaultMessage: 'Changelog',
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  navHome: {
    id: 'nav.home',
    defaultMessage: 'Home',
  },
  navLibrary: {
    id: 'nav.library',
    defaultMessage: 'Library',
  },
  navCommunity: {
    id: 'nav.community',
    defaultMessage: 'Community',
  },
  navLogin: {
    id: 'nav.login',
    defaultMessage: 'Login',
  },
  navProfile: {
    id: 'nav.profile',
    defaultMessage: 'Profile',
  },
  navLogout: {
    id: 'nav.logout',
    defaultMessage: 'Logout',
  },

  // ── Library page ──────────────────────────────────────────────────────────
  libraryHeroEyebrow: {
    id: 'library.hero.eyebrow',
    defaultMessage: 'Book Discovery',
  },
  libraryHeroTitle: {
    id: 'library.hero.title',
    defaultMessage: 'Library',
  },
  libraryHeroSubtitle: {
    id: 'library.hero.subtitle',
    defaultMessage: 'Search millions of books, authors & series',
  },
  librarySearchPlaceholderBooks: {
    id: 'library.search.placeholder.books',
    defaultMessage: 'Search by title, series…',
  },
  librarySearchPlaceholderAuthors: {
    id: 'library.search.placeholder.authors',
    defaultMessage: 'Search for an author…',
  },
  librarySearchModeBooks: {
    id: 'library.search.mode.books',
    defaultMessage: 'Books',
  },
  librarySearchModeAuthors: {
    id: 'library.search.mode.authors',
    defaultMessage: 'Authors',
  },
  libraryFiltersResultSingular: {
    id: 'library.filters.results.singular',
    defaultMessage: 'result',
  },
  libraryFiltersResultPlural: {
    id: 'library.filters.results.plural',
    defaultMessage: 'results',
  },
  libraryFiltersHide: {
    id: 'library.filters.hide',
    defaultMessage: 'Hide',
  },
  libraryFiltersShow: {
    id: 'library.filters.show',
    defaultMessage: 'Filters',
  },
  libraryFiltersFilterSingular: {
    id: 'library.filters.filter.singular',
    defaultMessage: 'filter',
  },
  libraryFiltersFilterPlural: {
    id: 'library.filters.filter.plural',
    defaultMessage: 'filters',
  },
  libraryFiltersSectionAuthor: {
    id: 'library.filters.section.author',
    defaultMessage: 'Author',
  },
  libraryFiltersSectionType: {
    id: 'library.filters.section.type',
    defaultMessage: 'Type',
  },
  libraryFiltersAll: {
    id: 'library.filters.all',
    defaultMessage: 'All',
  },
  libraryFiltersSortRelevance: {
    id: 'library.filters.sort.relevance',
    defaultMessage: 'Relevance',
  },
  libraryFiltersSortRatingDesc: {
    id: 'library.filters.sort.ratingDesc',
    defaultMessage: 'Rating ↓',
  },
  libraryFiltersSortTitleAsc: {
    id: 'library.filters.sort.titleAsc',
    defaultMessage: 'Title A–Z',
  },
  libraryFiltersSortTitleDesc: {
    id: 'library.filters.sort.titleDesc',
    defaultMessage: 'Title Z–A',
  },
  libraryFiltersSeriesAll: {
    id: 'library.filters.series.all',
    defaultMessage: 'All',
  },
  libraryFiltersSeriesOnly: {
    id: 'library.filters.series.seriesOnly',
    defaultMessage: 'Series',
  },
  libraryFiltersSeriesStandalone: {
    id: 'library.filters.series.standalone',
    defaultMessage: 'Standalone',
  },
  libraryEmptyNoFiltersTitle: {
    id: 'library.empty.noFiltersMatch.title',
    defaultMessage: 'No matches for these filters',
  },
  libraryEmptyNoFiltersSubtitle: {
    id: 'library.empty.noFiltersMatch.subtitle',
    defaultMessage:
      'Try adjusting or removing some filters to see more results.',
  },
  libraryEmptyNoFiltersAction: {
    id: 'library.empty.noFiltersMatch.action',
    defaultMessage: 'Clear all filters',
  },
  libraryEmptyNoResultsTitle: {
    id: 'library.empty.noResults.title',
    defaultMessage: 'No books found',
  },
  libraryEmptyNoResultsSubtitle: {
    id: 'library.empty.noResults.subtitle',
    defaultMessage:
      "We couldn't find anything for that query. Try different keywords.",
  },
  libraryEmptyInitial: {
    id: 'library.empty.initial',
    defaultMessage: 'Type a title, author or series to get started',
  },
  libraryAuthorBooks: {
    id: 'library.author.books',
    defaultMessage: 'book',
  },
  libraryAuthorBooksPlural: {
    id: 'library.author.books.plural',
    defaultMessage: 'books',
  },
  libraryAuthorLabel: {
    id: 'library.author.label',
    defaultMessage: 'Author',
  },

  // ── Community page ────────────────────────────────────────────────────────
  communityHeroEyebrow: {
    id: 'community.hero.eyebrow',
    defaultMessage: 'Social Reading',
  },
  communityHeroTitle: {
    id: 'community.hero.title',
    defaultMessage: 'Community',
  },
  communityHeroSubtitle: {
    id: 'community.hero.subtitle',
    defaultMessage: 'Discover new readers & connect with friends',
  },
  communityTabDiscover: {
    id: 'community.tab.discover',
    defaultMessage: 'Discover',
  },
  communityTabFriends: {
    id: 'community.tab.friends',
    defaultMessage: 'Friends',
  },
  communityDiscoverSearchPlaceholder: {
    id: 'community.discover.search.placeholder',
    defaultMessage: 'Search for users to add...',
  },
  communityDiscoverNoResults: {
    id: 'community.discover.noResults',
    defaultMessage: 'No users found. Try a different search.',
  },
  communityDiscoverEmpty: {
    id: 'community.discover.empty',
    defaultMessage: 'Start typing to discover new users to add as friends',
  },
  communityDiscoverFriendBadge: {
    id: 'community.discover.friendBadge',
    defaultMessage: 'Friend',
  },
  communityDiscoverRequestSent: {
    id: 'community.discover.requestSent',
    defaultMessage: 'Friend request sent successfully!',
  },
  communityDiscoverRequestError: {
    id: 'community.discover.requestError',
    defaultMessage: 'Could not send friend request. Try again.',
  },
  communityFriendsSearchPlaceholder: {
    id: 'community.friends.search.placeholder',
    defaultMessage: 'Search in your friends...',
  },
  communityFriendsNoResults: {
    id: 'community.friends.noResults',
    defaultMessage: 'No friends found.',
  },
  communityFriendsEmpty: {
    id: 'community.friends.empty',
    defaultMessage: "You don't have any friends yet.",
  },
  communityFriendsDeleteSuccess: {
    id: 'community.friends.deleteSuccess',
    defaultMessage: 'Friend deleted successfully.',
  },
  communityFriendsDeleteError: {
    id: 'community.friends.deleteError',
    defaultMessage: 'Error deleting friend.',
  },

  // ── Book detail page ──────────────────────────────────────────────────────
  bookDetailHallOfFameAdd: {
    id: 'book.detail.hallOfFame.add',
    defaultMessage: 'Hall of Fame',
  },
  bookDetailHallOfFameIn: {
    id: 'book.detail.hallOfFame.in',
    defaultMessage: 'In Hall of Fame',
  },
  bookDetailPages: {
    id: 'book.detail.pages',
    defaultMessage: 'pages',
  },
  bookDetailEditionSingular: {
    id: 'book.detail.edition.singular',
    defaultMessage: 'edition',
  },
  bookDetailEditionPlural: {
    id: 'book.detail.edition.plural',
    defaultMessage: 'editions',
  },
  bookDetailAboutAuthor: {
    id: 'book.detail.about.author',
    defaultMessage: 'About the author',
  },
  bookDetailViewProfile: {
    id: 'book.detail.view.profile',
    defaultMessage: 'View full profile',
  },
  bookDetailHallOfFameAddSuccess: {
    id: 'book.detail.hallOfFame.add.success',
    defaultMessage: 'Book added to Hall of Fame successfully!',
  },
  bookDetailHallOfFameAddError: {
    id: 'book.detail.hallOfFame.add.error',
    defaultMessage: 'Error adding book to Hall of Fame.',
  },
  bookDetailHallOfFameDeleteSuccess: {
    id: 'book.detail.hallOfFame.delete.success',
    defaultMessage: 'Book deleted from Hall of Fame!',
  },
  bookDetailHallOfFameDeleteError: {
    id: 'book.detail.hallOfFame.delete.error',
    defaultMessage: 'Error deleting book from Hall of Fame.',
  },

  // ── Book rating widget ────────────────────────────────────────────────────
  bookRatingStatusWantToRead: {
    id: 'book.rating.status.wantToRead',
    defaultMessage: 'Want to read',
  },
  bookRatingStatusReading: {
    id: 'book.rating.status.reading',
    defaultMessage: 'Reading',
  },
  bookRatingStatusRead: {
    id: 'book.rating.status.read',
    defaultMessage: 'Read',
  },
  bookRatingSignIn: {
    id: 'book.rating.signIn',
    defaultMessage: 'Sign in to rate this book',
  },
  bookRatingTitle: {
    id: 'book.rating.title',
    defaultMessage: 'Book Details',
  },
  bookRatingSectionRating: {
    id: 'book.rating.section.rating',
    defaultMessage: 'Rating',
  },
  bookRatingSectionStatus: {
    id: 'book.rating.section.status',
    defaultMessage: 'Status',
  },
  bookRatingSectionReadingPeriod: {
    id: 'book.rating.section.readingPeriod',
    defaultMessage: 'Reading Period',
  },
  bookRatingStartDate: {
    id: 'book.rating.startDate',
    defaultMessage: 'Start Date',
  },
  bookRatingEndDate: {
    id: 'book.rating.endDate',
    defaultMessage: 'End Date',
  },
  bookRatingStart: {
    id: 'book.rating.start',
    defaultMessage: 'Start',
  },
  bookRatingEnd: {
    id: 'book.rating.end',
    defaultMessage: 'End',
  },
  bookRatingApply: {
    id: 'book.rating.apply',
    defaultMessage: 'Apply Changes',
  },
  bookRatingReviewPlaceholder: {
    id: 'book.rating.review.placeholder',
    defaultMessage: 'Write your review...',
  },
  bookRatingProgress: {
    id: 'book.rating.progress',
    defaultMessage: 'Progress',
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboardGreetingHello: {
    id: 'dashboard.greeting.hello',
    defaultMessage: 'Hello',
  },
  dashboardGreetingMorning: {
    id: 'dashboard.greeting.morning',
    defaultMessage: 'Good Morning',
  },
  dashboardGreetingAfternoon: {
    id: 'dashboard.greeting.afternoon',
    defaultMessage: 'Good Afternoon',
  },
  dashboardGreetingEvening: {
    id: 'dashboard.greeting.evening',
    defaultMessage: 'Good Evening',
  },

  dashboardCurrentlyReadingTitle: {
    id: 'dashboard.currentlyReading.title',
    defaultMessage: 'Currently Reading',
  },
  dashboardCurrentlyReadingEmpty: {
    id: 'dashboard.currentlyReading.empty',
    defaultMessage: 'No books currently reading',
  },
  dashboardCurrentlyReadingEmptyHint: {
    id: 'dashboard.currentlyReading.emptyHint',
    defaultMessage: 'Start reading a book to see your progress here',
  },
  dashboardCurrentlyReadingEmptyMobile: {
    id: 'dashboard.currentlyReading.emptyMobile',
    defaultMessage: 'No book in progress',
  },

  dashboardStatsTitle: {
    id: 'dashboard.stats.title',
    defaultMessage: 'Reading Stats',
  },
  dashboardStatsTotalBooks: {
    id: 'dashboard.stats.totalBooks',
    defaultMessage: 'Total Books',
  },
  dashboardStatsBooksRead: {
    id: 'dashboard.stats.booksRead',
    defaultMessage: 'Books Read',
  },
  dashboardStatsReadIn: {
    id: 'dashboard.stats.readIn',
    defaultMessage: 'Read in',
  },
  dashboardStatsMiniLibrary: {
    id: 'dashboard.stats.library',
    defaultMessage: 'Library',
  },
  dashboardStatsMiniRead: {
    id: 'dashboard.stats.read',
    defaultMessage: 'Read',
  },

  dashboardQuickActionsTitle: {
    id: 'dashboard.quickActions.title',
    defaultMessage: 'Quick Actions',
  },
  dashboardQuickActionsBooks: {
    id: 'dashboard.quickActions.books',
    defaultMessage: 'Books',
  },
  dashboardQuickActionsMyStats: {
    id: 'dashboard.quickActions.myStats',
    defaultMessage: 'My Stats',
  },
  dashboardQuickActionsCalendar: {
    id: 'dashboard.quickActions.calendar',
    defaultMessage: 'Calendar',
  },
  dashboardQuickActionsHallOfFame: {
    id: 'dashboard.quickActions.hallOfFame',
    defaultMessage: 'Hall of Fame',
  },
  dashboardQuickActionsCommunity: {
    id: 'dashboard.quickActions.community',
    defaultMessage: 'Community',
  },
  dashboardQuickActionsTimeline: {
    id: 'dashboard.quickActions.timeline',
    defaultMessage: 'Timeline',
  },

  dashboardActivityTitle: {
    id: 'dashboard.activity.title',
    defaultMessage: 'Friends Activity',
  },
  dashboardActivityEmpty: {
    id: 'dashboard.activity.empty',
    defaultMessage: 'No friend activities yet',
  },
  dashboardActivityEmptyHint: {
    id: 'dashboard.activity.emptyHint',
    defaultMessage: 'Add friends to see their reading activities here',
  },
  dashboardActivityEmptyMobile: {
    id: 'dashboard.activity.emptyMobile',
    defaultMessage: 'No activity yet',
  },
  dashboardActivityEmptyMobileHint: {
    id: 'dashboard.activity.emptyMobileHint',
    defaultMessage: 'Add friends to see their reading updates here',
  },
  dashboardActivityStarted: {
    id: 'dashboard.activity.started',
    defaultMessage: 'Started Reading',
  },
  dashboardActivityFinished: {
    id: 'dashboard.activity.finished',
    defaultMessage: 'Finished',
  },
  dashboardActivityRated: {
    id: 'dashboard.activity.rated',
    defaultMessage: 'Rated',
  },
  dashboardActivityProgress: {
    id: 'dashboard.activity.progress',
    defaultMessage: 'Progress Update',
  },
  dashboardActivityWantToRead: {
    id: 'dashboard.activity.wantToRead',
    defaultMessage: 'Want to Read',
  },
  dashboardActivityReviewed: {
    id: 'dashboard.activity.reviewed',
    defaultMessage: 'Reviewed',
  },
  dashboardActivityOther: {
    id: 'dashboard.activity.other',
    defaultMessage: 'Activity',
  },
  dashboardActivityStartedShort: {
    id: 'dashboard.activity.startedShort',
    defaultMessage: 'Started',
  },
  dashboardActivityProgressShort: {
    id: 'dashboard.activity.progressShort',
    defaultMessage: 'Progress',
  },

  dashboardSectionCurrentlyReading: {
    id: 'dashboard.section.currentlyReading',
    defaultMessage: 'Currently Reading',
  },
  dashboardSectionStats: {
    id: 'dashboard.section.stats',
    defaultMessage: 'Stats',
  },
  dashboardSectionFriendsActivity: {
    id: 'dashboard.section.friendsActivity',
    defaultMessage: 'Friends Activity',
  },

  // ── Activity messages (regex-parsed from API, interpolated with {placeholders}) ──
  activityMessageStarted: {
    id: 'activity.message.started',
    defaultMessage: '{username} started reading "{title}" by {author}.',
  },
  activityMessageFinished: {
    id: 'activity.message.finished',
    defaultMessage: '{username} finished reading "{title}" by {author}.',
  },
  activityMessageRated: {
    id: 'activity.message.rated',
    defaultMessage: '{username} gave {rating} stars to "{title}" by {author}.',
  },
  activityMessageProgressPercent: {
    id: 'activity.message.progress.percent',
    defaultMessage:
      '{username} made {percent}% progress on "{title}" by {author}.',
  },
  activityMessageProgressPages: {
    id: 'activity.message.progress.pages',
    defaultMessage:
      '{username} made progress ({pages} pages) in "{title}" by {author}.',
  },
  activityMessageWantToRead: {
    id: 'activity.message.wantToRead',
    defaultMessage:
      '{username} added "{title}" by {author} to their reading list.',
  },

  // ── Activity badges ────────────────────────────────────────────────────────
  activityBadgeStars: { id: 'activity.badge.stars', defaultMessage: 'stars' },
  activityBadgeReview: {
    id: 'activity.badge.review',
    defaultMessage: 'Review',
  },
  dashboardReadingProgressCompleted: {
    id: 'dashboard.reading.completed',
    defaultMessage: 'completed',
  },

  // ── Profile page ──────────────────────────────────────────────────────────

  // page.tsx alerts
  profileBiographyUpdateSuccess: {
    id: 'profile.biography.updateSuccess',
    defaultMessage: 'Biography updated successfully',
  },
  profileBiographyUpdateError: {
    id: 'profile.biography.updateError',
    defaultMessage: 'Error updating biography',
  },

  // ProfileHeader tooltips & chips
  profileHeaderFriends: {
    id: 'profile.header.friends',
    defaultMessage: '{count} friends',
  },
  profileTooltipCopied: {
    id: 'profile.tooltip.copied',
    defaultMessage: 'Copied!',
  },
  profileTooltipShare: {
    id: 'profile.tooltip.share',
    defaultMessage: 'Share Profile',
  },
  profileTooltipEditAccount: {
    id: 'profile.tooltip.editAccount',
    defaultMessage: 'Edit Account',
  },
  profileTooltipEditProfile: {
    id: 'profile.tooltip.editProfile',
    defaultMessage: 'Edit Profile',
  },
  profileTooltipImport: {
    id: 'profile.tooltip.import',
    defaultMessage: 'Import from Goodreads or Hardcover',
  },
  profileTooltipLogOut: {
    id: 'profile.tooltip.logOut',
    defaultMessage: 'Log Out',
  },
  profileTooltipAddFriend: {
    id: 'profile.tooltip.addFriend',
    defaultMessage: 'Add friend',
  },
  profileTooltipRemoveFriend: {
    id: 'profile.tooltip.removeFriend',
    defaultMessage: 'Remove friend',
  },

  // BiographySection
  profileBiographyPlaceholder: {
    id: 'profile.biography.placeholder',
    defaultMessage: 'Write your biography here…',
  },
  profileBiographyCancelTooltip: {
    id: 'profile.biography.cancelTooltip',
    defaultMessage: 'Cancel (Esc)',
  },
  profileBiographySaveTooltip: {
    id: 'profile.biography.saveTooltip',
    defaultMessage: 'Save (Ctrl+Enter)',
  },

  // ProfileNavigation tabs
  profileNavLibrary: { id: 'profile.nav.library', defaultMessage: 'Library' },
  profileNavHallOfFame: {
    id: 'profile.nav.hallOfFame',
    defaultMessage: 'Hall of Fame',
  },
  profileNavStats: { id: 'profile.nav.stats', defaultMessage: 'Stats' },
  profileNavActivity: {
    id: 'profile.nav.activity',
    defaultMessage: 'Activity',
  },
  profileNavLists: { id: 'profile.nav.lists', defaultMessage: 'Lists' },

  // BooksStats / BooksStatsDisplay labels
  profileStatsReading: {
    id: 'profile.stats.reading',
    defaultMessage: 'Reading',
  },
  profileStatsRead: { id: 'profile.stats.read', defaultMessage: 'Read' },
  profileStatsWantToRead: {
    id: 'profile.stats.wantToRead',
    defaultMessage: 'Want to Read',
  },

  // BooksFilter / CompactBooksFilter / MobileDrawer
  profileFilterSearch: {
    id: 'profile.filter.search',
    defaultMessage: 'Search books...',
  },
  profileFilterTitle: { id: 'profile.filter.title', defaultMessage: 'Filters' },
  profileFilterStatus: {
    id: 'profile.filter.status',
    defaultMessage: 'Status',
  },
  profileFilterAuthor: {
    id: 'profile.filter.author',
    defaultMessage: 'Author',
  },
  profileFilterSeries: {
    id: 'profile.filter.series',
    defaultMessage: 'Series',
  },
  profileFilterRating: {
    id: 'profile.filter.rating',
    defaultMessage: 'Rating',
  },
  profileFilterOrderBy: {
    id: 'profile.filter.orderBy',
    defaultMessage: 'Order by',
  },
  profileFilterSort: { id: 'profile.filter.sort', defaultMessage: 'Sort' },
  profileFilterAll: { id: 'profile.filter.all', defaultMessage: 'All' },
  profileFilterOrderOriginal: {
    id: 'profile.filter.order.original',
    defaultMessage: 'Original',
  },
  profileFilterOrderTitle: {
    id: 'profile.filter.order.title',
    defaultMessage: 'Title',
  },
  profileFilterActiveStatus: {
    id: 'profile.filter.active.status',
    defaultMessage: 'Status: {value}',
  },
  profileFilterActiveAuthor: {
    id: 'profile.filter.active.author',
    defaultMessage: 'Author: {author}',
  },
  profileFilterActiveSeries: {
    id: 'profile.filter.active.series',
    defaultMessage: 'Series: {series}',
  },
  profileFilterActiveRating: {
    id: 'profile.filter.active.rating',
    defaultMessage: 'Rating: {stars}+',
  },
  profileFilterClearAll: {
    id: 'profile.filter.clearAll',
    defaultMessage: 'Clear All',
  },

  // ReadingTimeline
  profileTimelineEmptyTitle: {
    id: 'profile.timeline.empty.title',
    defaultMessage: 'No reading history yet',
  },
  profileTimelineEmptySubtitle: {
    id: 'profile.timeline.empty.subtitle',
    defaultMessage:
      'Start tracking your reading journey with start and end dates',
  },
  profileTimelineTitle: {
    id: 'profile.timeline.title',
    defaultMessage: 'Reading Journey',
  },
  profileTimelineSubtitle: {
    id: 'profile.timeline.subtitle',
    defaultMessage: 'Your adventure through {count} books',
  },
  profileTimelineCompleted: {
    id: 'profile.timeline.completed',
    defaultMessage: '{count} completed',
  },
  profileTimelineReading: {
    id: 'profile.timeline.reading',
    defaultMessage: '{count} reading',
  },
  profileTimelinePagesPerDay: {
    id: 'profile.timeline.pagesPerDay',
    defaultMessage: '{count} pages/day avg',
  },
  profileTimelineNow: { id: 'profile.timeline.now', defaultMessage: 'Now' },

  // ReadingCalendar
  profileCalendarEmptyTitle: {
    id: 'profile.calendar.empty.title',
    defaultMessage: 'No reading history yet',
  },
  profileCalendarEmptySubtitle: {
    id: 'profile.calendar.empty.subtitle',
    defaultMessage:
      'Start tracking your reading journey with start and end dates',
  },
  profileCalendarFinished: {
    id: 'profile.calendar.stats.finished',
    defaultMessage: 'Finished',
  },
  profileCalendarPages: {
    id: 'profile.calendar.stats.pages',
    defaultMessage: 'Pages',
  },
  profileCalendarReading: {
    id: 'profile.calendar.stats.reading',
    defaultMessage: 'Reading',
  },

  // GoodreadsImportModal
  profileImportTitle: {
    id: 'profile.import.title',
    defaultMessage: 'Import CSV',
  },
  profileImportChipHardcoverDetected: {
    id: 'profile.import.chip.hardcoverDetected',
    defaultMessage: 'Hardcover detected',
  },
  profileImportChipGoodreadsDetected: {
    id: 'profile.import.chip.goodreadsDetected',
    defaultMessage: 'Goodreads detected',
  },
  profileImportStatusParsing: {
    id: 'profile.import.status.parsing',
    defaultMessage: 'Parsing CSV…',
  },
  profileImportErrorGeneric: {
    id: 'profile.import.error.generic',
    defaultMessage: 'Something went wrong.',
  },
  profileImportActionTryAgain: {
    id: 'profile.import.action.tryAgain',
    defaultMessage: 'Try again',
  },
  profileImportStatusSaving: {
    id: 'profile.import.status.saving',
    defaultMessage: 'Saving to your library…',
  },
  profileImportProgressStatus: {
    id: 'profile.import.progress.status',
    defaultMessage: '{saved} saved · {failed} failed',
  },
  profileImportStatusDone: {
    id: 'profile.import.status.done',
    defaultMessage: 'Import complete!',
  },
  profileImportChipSaved: {
    id: 'profile.import.chip.saved',
    defaultMessage: '{count} saved',
  },
  profileImportChipFailed: {
    id: 'profile.import.chip.failed',
    defaultMessage: '{count} failed',
  },
  profileImportErrorCouldNotSave: {
    id: 'profile.import.error.couldNotSave',
    defaultMessage: 'Could not be saved:',
  },
  profileImportActionClose: {
    id: 'profile.import.action.close',
    defaultMessage: 'Close',
  },
  profileImportErrorImportFailed: {
    id: 'profile.import.error.importFailed',
    defaultMessage: 'Import failed.',
  },
  profileImportStatusFetchingHardcover: {
    id: 'profile.import.status.fetchingHardcover',
    defaultMessage: 'Fetching your Hardcover library…',
  },
  profileImportStatusSearching: {
    id: 'profile.import.status.searching',
    defaultMessage: 'Searching Hardcover…',
  },
  profileImportFilterLabel: {
    id: 'profile.import.filter.label',
    defaultMessage: 'Filter:',
  },
  profileImportActionDeselectAll: {
    id: 'profile.import.action.deselectAll',
    defaultMessage: 'Deselect all',
  },
  profileImportActionSelectAll: {
    id: 'profile.import.action.selectAll',
    defaultMessage: 'Select all',
  },
  profileImportChipSelected: {
    id: 'profile.import.chip.selected',
    defaultMessage: '{count} selected',
  },
  profileImportEmptyShelf: {
    id: 'profile.import.empty.shelf',
    defaultMessage: 'No books in this shelf.',
  },
  profileImportNotFound: {
    id: 'profile.import.notFound',
    defaultMessage: 'Not found on Hardcover ({count})',
  },
  profileImportActionUploadAnother: {
    id: 'profile.import.action.uploadAnother',
    defaultMessage: 'Upload another file',
  },
  profileImportAlreadyInLibrary: {
    id: 'profile.import.alreadyInLibrary',
    defaultMessage: '{count} already in your library (data will be updated)',
  },
  profileImportActionImportSingular: {
    id: 'profile.import.action.importSingular',
    defaultMessage: 'Import {count} book',
  },
  profileImportActionImportPlural: {
    id: 'profile.import.action.importPlural',
    defaultMessage: 'Import {count} books',
  },
  profileImportUploadTitle: {
    id: 'profile.import.upload.title',
    defaultMessage: 'Upload your library export',
  },
  profileImportUploadHint: {
    id: 'profile.import.upload.hint',
    defaultMessage: 'The format is detected automatically.',
  },
  profileImportUploadButton: {
    id: 'profile.import.upload.button',
    defaultMessage: 'Choose CSV file',
  },
  profileImportShelfAll: {
    id: 'profile.import.shelf.all',
    defaultMessage: 'All',
  },
  profileImportShelfRead: {
    id: 'profile.import.shelf.read',
    defaultMessage: 'Read',
  },
  profileImportShelfToRead: {
    id: 'profile.import.shelf.toRead',
    defaultMessage: 'To Read',
  },
  profileImportShelfReading: {
    id: 'profile.import.shelf.reading',
    defaultMessage: 'Reading',
  },

  // Hall of Fame
  hallOfFameTitle: { id: 'hallOfFame.title', defaultMessage: 'Hall of Fame' },
  hallOfFameFavouriteSingular: {
    id: 'hallOfFame.favourite.singular',
    defaultMessage: 'favourite',
  },
  hallOfFameFavouritePlural: {
    id: 'hallOfFame.favourite.plural',
    defaultMessage: 'favourites',
  },
  hallOfFameErrorLoad: {
    id: 'hallOfFame.error.load',
    defaultMessage: 'Error loading Hall of Fame.',
  },
  hallOfFameQuoteUpdated: {
    id: 'hallOfFame.quote.updated',
    defaultMessage: 'Quote updated successfully!',
  },
  hallOfFameQuoteUpdateError: {
    id: 'hallOfFame.quote.updateError',
    defaultMessage: 'Failed to update quote. Please try again.',
  },

  // Stats
  statsRatingStats: { id: 'stats.ratingStats', defaultMessage: 'Rating Stats' },
  statsBookStatus: { id: 'stats.bookStatus', defaultMessage: 'Book status' },
  statsPageCount: { id: 'stats.pageCount', defaultMessage: 'Page Count' },
  statsReaderDna: { id: 'stats.readerDna', defaultMessage: 'Reader DNA' },
  statsBooksThisYear: {
    id: 'stats.booksThisYear',
    defaultMessage: 'Books this year',
  },
  statsMonthlyActivity: {
    id: 'stats.monthlyActivity',
    defaultMessage: 'Monthly Activity',
  },
  statsReadingPace: { id: 'stats.readingPace', defaultMessage: 'Reading pace' },
  statsReadingHighlights: {
    id: 'stats.readingHighlights',
    defaultMessage: 'Reading highlights',
  },
  statsAuthorsRead: { id: 'stats.authorsRead', defaultMessage: 'Authors read' },
  statsEmpty: {
    id: 'stats.empty',
    defaultMessage:
      'No statistics available yet. Start adding books to your library!',
  },
  statsError: {
    id: 'stats.error',
    defaultMessage: 'Error loading statistics: {message}',
  },

  // Activity empty state
  activityEmptyTitle: {
    id: 'activity.empty.title',
    defaultMessage: 'No Activity Yet',
  },
  activityEmptySubtitle: {
    id: 'activity.empty.subtitle',
    defaultMessage: 'Your reading activities will appear here',
  },

  // RatingStats
  statsRatingNoData: {
    id: 'stats.rating.noData',
    defaultMessage: 'No ratings available yet',
  },
  statsRatingAverage: {
    id: 'stats.rating.average',
    defaultMessage: 'Average rating • {count} books',
  },

  // DonutChart
  statsDonutNoData: {
    id: 'stats.donut.noData',
    defaultMessage: 'No book status data available',
  },
  statsDonutNoValidStatus: {
    id: 'stats.donut.noValidStatus',
    defaultMessage: 'No books with valid status',
  },
  statsStatusRead: { id: 'stats.status.read', defaultMessage: 'Read' },
  statsStatusReading: { id: 'stats.status.reading', defaultMessage: 'Reading' },
  statsStatusWantToRead: {
    id: 'stats.status.wantToRead',
    defaultMessage: 'Want to read',
  },

  // PageCountKPI
  statsPagesNoData: {
    id: 'stats.pages.noData',
    defaultMessage: 'No page data available',
  },
  statsPagesRead: { id: 'stats.pages.read', defaultMessage: 'Pages Read' },
  statsPagesGoal: {
    id: 'stats.pages.goal',
    defaultMessage: 'Goal: {pages} pages',
  },
  statsPagesGoalHint: {
    id: 'stats.pages.goalHint',
    defaultMessage:
      'The total goal value is an addition of read pages and want to read pages',
  },

  // ReadingRadar
  statsRadarNoData: {
    id: 'stats.radar.noData',
    defaultMessage: 'Add books to your library to unlock your reading profile',
  },
  statsRadarCompletionist: {
    id: 'stats.radar.completionist',
    defaultMessage: 'Completionist',
  },
  statsRadarCritic: { id: 'stats.radar.critic', defaultMessage: 'Critic' },
  statsRadarRater: { id: 'stats.radar.rater', defaultMessage: 'Rater' },
  statsRadarDiverse: { id: 'stats.radar.diverse', defaultMessage: 'Diverse' },
  statsRadarSeriesFan: {
    id: 'stats.radar.seriesFan',
    defaultMessage: 'Series Fan',
  },
  statsRadarActive: { id: 'stats.radar.active', defaultMessage: 'Active' },
  statsRadarTooltipCompletionist: {
    id: 'stats.radar.tooltip.completionist',
    defaultMessage: "How much of your library you've actually finished.",
  },
  statsRadarTooltipCritic: {
    id: 'stats.radar.tooltip.critic',
    defaultMessage: 'How often you write a review after finishing a book.',
  },
  statsRadarTooltipRater: {
    id: 'stats.radar.tooltip.rater',
    defaultMessage: 'How consistently you rate books after reading them.',
  },
  statsRadarTooltipDiverse: {
    id: 'stats.radar.tooltip.diverse',
    defaultMessage: 'How varied your reading is across different authors.',
  },
  statsRadarTooltipSeriesFan: {
    id: 'stats.radar.tooltip.seriesFan',
    defaultMessage: 'How much you follow ongoing book series.',
  },
  statsRadarTooltipActive: {
    id: 'stats.radar.tooltip.active',
    defaultMessage: 'Your reading pace this year vs. a 20-books goal.',
  },

  // BooksReadThisYear
  statsBooksYearRead: {
    id: 'stats.booksYear.read',
    defaultMessage: 'books read in {year}',
  },
  statsBooksYearTrendUp: {
    id: 'stats.booksYear.trendUp',
    defaultMessage: '+{diff} vs {year}',
  },
  statsBooksYearTrendDown: {
    id: 'stats.booksYear.trendDown',
    defaultMessage: '{diff} vs {year}',
  },
  statsBooksYearTrendSame: {
    id: 'stats.booksYear.trendSame',
    defaultMessage: 'Same as {year}',
  },

  // MonthlyActivitySparkline
  statsMonthlyNoData: {
    id: 'stats.monthly.noData',
    defaultMessage: 'Finish some books this year to see your monthly activity',
  },
  statsMonthlyBooksThisYear: {
    id: 'stats.monthly.booksThisYear',
    defaultMessage: 'Books this year',
  },
  statsMonthlyBestIn: {
    id: 'stats.monthly.bestIn',
    defaultMessage: 'Best in {month}',
  },
  statsMonthlyStreak: {
    id: 'stats.monthly.streak',
    defaultMessage: 'Month streak',
  },
  statsMonthlyPeakChip: {
    id: 'stats.monthly.peakChip',
    defaultMessage: 'Peak: {month} — {count} books',
  },
  statsMonthlyStreakChip: {
    id: 'stats.monthly.streakChip',
    defaultMessage: '{count}-month reading streak',
  },

  // AvgReadingDays
  statsAvgNoData: {
    id: 'stats.avg.noData',
    defaultMessage: 'Add start & end dates to your books to see this stat',
  },
  statsAvgDays: { id: 'stats.avg.days', defaultMessage: 'days' },
  statsAvgPerBook: {
    id: 'stats.avg.perBook',
    defaultMessage: 'Avg. days per book',
  },
  statsAvgSpeedReader: {
    id: 'stats.avg.speedReader',
    defaultMessage: 'Speed reader',
  },
  statsAvgSteadyReader: {
    id: 'stats.avg.steadyReader',
    defaultMessage: 'Steady reader',
  },
  statsAvgCasualReader: {
    id: 'stats.avg.casualReader',
    defaultMessage: 'Casual reader',
  },
  statsAvgSlowSteady: {
    id: 'stats.avg.slowSteady',
    defaultMessage: 'Slow & steady',
  },
  statsAvgNoDataLabel: {
    id: 'stats.avg.noDataLabel',
    defaultMessage: 'No data yet',
  },
  statsAvgScaleSpeed: {
    id: 'stats.avg.scale.speed',
    defaultMessage: '≤5d · Speed reader',
  },
  statsAvgScaleSteady: {
    id: 'stats.avg.scale.steady',
    defaultMessage: '≤14d · Steady',
  },
  statsAvgScaleCasual: {
    id: 'stats.avg.scale.casual',
    defaultMessage: '≤30d · Casual',
  },
  statsAvgScaleSlow: {
    id: 'stats.avg.scale.slow',
    defaultMessage: '>30d · Slow & steady',
  },

  // ReadingHighlights
  statsHighlightsCompletionRate: {
    id: 'stats.highlights.completionRate',
    defaultMessage: 'Completion rate',
  },
  statsHighlightsBooksReviewed: {
    id: 'stats.highlights.booksReviewed',
    defaultMessage: 'Books reviewed',
  },
  statsHighlightsSeries: {
    id: 'stats.highlights.series',
    defaultMessage: 'Series',
  },

  // Author page
  authorBadge: { id: 'author.badge', defaultMessage: 'Author' },
  authorBooks: { id: 'author.books', defaultMessage: '{count} books' },
  authorBornYear: { id: 'author.bornYear', defaultMessage: 'b. {year}' },
  authorBooksSection: { id: 'author.booksSection', defaultMessage: 'Books' },
  authorNoBooksFound: {
    id: 'author.noBooksFound',
    defaultMessage: 'No books found for this author.',
  },
  authorNotFound: {
    id: 'author.notFound',
    defaultMessage: 'Author not found.',
  },

  // Friend Requests panel
  friendRequestsTitle: {
    id: 'friends.requests.title',
    defaultMessage: 'Friend Requests',
  },
  friendRequestsEmpty: {
    id: 'friends.requests.empty',
    defaultMessage: 'No pending friend requests',
  },

  // BookCardCompact
  bookCardStatusRated: {
    id: 'book.card.status.rated',
    defaultMessage: 'Rated',
  },
  bookCardPages: { id: 'book.card.pages', defaultMessage: '{count} pages' },
  bookProgressPagesSuffix: {
    id: 'book.progress.pages.suffix',
    defaultMessage: 'pages.',
  },

  // AI Recommendations Panel
  aiPanelTooltipRecommend: {
    id: 'ai.panel.tooltip.recommend',
    defaultMessage: 'AI Book Recommendations',
  },
  aiPanelTooltipDiscover: {
    id: 'ai.panel.tooltip.discover',
    defaultMessage: 'Discover new books with AI',
  },
  aiPanelHeaderAdvisor: {
    id: 'ai.panel.header.advisor',
    defaultMessage: 'AI Book Advisor',
  },
  aiPanelHeaderDiscoverer: {
    id: 'ai.panel.header.discoverer',
    defaultMessage: 'Book Discoverer',
  },
  aiPanelPlaceholderRecommend: {
    id: 'ai.panel.placeholder.recommend',
    defaultMessage: 'Ask about a book, genre, or mood\u2026',
  },
  aiPanelPlaceholderDiscover: {
    id: 'ai.panel.placeholder.discover',
    defaultMessage: 'Ask for a genre, mood, or author style\u2026',
  },
  aiPanelReady: {
    id: 'ai.panel.ready',
    defaultMessage: 'Ready when you are\u2026',
  },
  aiPanelTryAgain: { id: 'ai.panel.tryAgain', defaultMessage: 'Try again' },

  // ── Profile view toggle ───────────────────────────────────────────────────
  profileViewGrid: { id: 'profile.view.grid', defaultMessage: 'Grid View' },
  profileViewList: { id: 'profile.view.list', defaultMessage: 'List View' },
  profileViewTimeline: {
    id: 'profile.view.timeline',
    defaultMessage: 'Timeline View',
  },
  profileViewCalendar: {
    id: 'profile.view.calendar',
    defaultMessage: 'Calendar View',
  },

  // ── Lists ─────────────────────────────────────────────────────────────────

  // ListsTab
  listsTabEmpty: {
    id: 'lists.tab.empty',
    defaultMessage: 'No lists yet. Create your first one!',
  },
  listsTabEmptyOther: {
    id: 'lists.tab.empty.other',
    defaultMessage: 'No lists yet.',
  },
  listsTabNewList: {
    id: 'lists.tab.new-list',
    defaultMessage: 'New list',
  },
  listsTabCreate: {
    id: 'lists.tab.create',
    defaultMessage: 'Create list',
  },

  // ListCard
  listsCardBooks: {
    id: 'lists.card.books',
    defaultMessage: '{count} book',
  },
  listsCardBooksPlural: {
    id: 'lists.card.books.plural',
    defaultMessage: '{count} books',
  },
  listsCardRead: {
    id: 'lists.card.read',
    defaultMessage: '{done} / {total} read',
  },

  // CreateListModal
  listsModalTitle: {
    id: 'lists.modal.title',
    defaultMessage: 'New list',
  },
  listsModalNameLabel: {
    id: 'lists.modal.name.label',
    defaultMessage: 'Name',
  },
  listsModalDescriptionLabel: {
    id: 'lists.modal.description.label',
    defaultMessage: 'Description (optional)',
  },
  listsModalCreate: {
    id: 'lists.modal.create',
    defaultMessage: 'Create list',
  },
  listsModalCreating: {
    id: 'lists.modal.creating',
    defaultMessage: 'Creating…',
  },

  // List detail page — status badges
  listsStatusReading: {
    id: 'lists.status.reading',
    defaultMessage: 'Reading',
  },
  listsStatusRead: {
    id: 'lists.status.read',
    defaultMessage: 'Read',
  },
  listsStatusWantToRead: {
    id: 'lists.status.want-to-read',
    defaultMessage: 'Want to read',
  },

  // List detail page — actions & UI
  listsDetailRemove: {
    id: 'lists.detail.remove',
    defaultMessage: 'Remove',
  },
  listsDetailSearchPlaceholder: {
    id: 'lists.detail.search.placeholder',
    defaultMessage: 'Search books to add…',
  },
  listsDetailAddToList: {
    id: 'lists.detail.add-to-list',
    defaultMessage: 'Add to list',
  },
  listsDetailAlreadyInList: {
    id: 'lists.detail.already-in-list',
    defaultMessage: 'Already in list',
  },
  listsDetailNamePlaceholder: {
    id: 'lists.detail.name.placeholder',
    defaultMessage: 'List name',
  },
  listsDetailDescriptionPlaceholder: {
    id: 'lists.detail.description.placeholder',
    defaultMessage: 'Description (optional)',
  },
  listsDetailSave: {
    id: 'lists.detail.save',
    defaultMessage: 'Save',
  },
  listsDetailCancel: {
    id: 'lists.detail.cancel',
    defaultMessage: 'Cancel',
  },
  listsDetailEditMeta: {
    id: 'lists.detail.edit-meta',
    defaultMessage: 'Edit name & description',
  },
  listsDetailNotFound: {
    id: 'lists.detail.not-found',
    defaultMessage: 'List not found.',
  },
  listsDetailEmpty: {
    id: 'lists.detail.empty',
    defaultMessage: 'This list is empty. Add some books above.',
  },
  listsDetailAddBooks: {
    id: 'lists.detail.add-books',
    defaultMessage: 'Add books',
  },
  listsDetailDragToReorder: {
    id: 'lists.detail.drag-to-reorder',
    defaultMessage: 'drag to reorder',
  },
  listsDetailInLibrary: {
    id: 'lists.detail.in-library',
    defaultMessage: 'In library',
  },
  listsDetailDeleteList: {
    id: 'lists.detail.delete-list',
    defaultMessage: 'Delete list',
  },
  listsDetailDeleteListConfirm: {
    id: 'lists.detail.delete-list.confirm',
    defaultMessage:
      'Are you sure you want to delete "{name}"? This action cannot be undone.',
  },
  listsDetailDeleting: {
    id: 'lists.detail.deleting',
    defaultMessage: 'Deleting...',
  },

  // ── Changelog page ────────────────────────────────────────────────────────
  changelogTitle: {
    id: 'changelog.title',
    defaultMessage: 'Changelog',
  },
  changelogSubtitle: {
    id: 'changelog.subtitle',
    defaultMessage: "Everything that's new in WingWords",
  },
  changelogBadgeLatest: {
    id: 'changelog.badge.latest',
    defaultMessage: 'Latest',
  },

  // v1.1
  changelogV11Date: {
    id: 'changelog.v1-1.date',
    defaultMessage: 'April 2026',
  },
  changelogV11Title: {
    id: 'changelog.v1-1.title',
    defaultMessage: 'Lists & New Languages',
  },
  changelogV11Intro: {
    id: 'changelog.v1-1.intro',
    defaultMessage:
      'This release brings several highly-requested improvements and brand-new features to WingWords:',
  },
  changelogV11Feature1: {
    id: 'changelog.v1-1.feature.1',
    defaultMessage: 'New languages: Spanish, Galician, and German.',
  },
  changelogV11Feature2: {
    id: 'changelog.v1-1.feature.2',
    defaultMessage:
      'Create and curate personal book lists with drag & drop reordering.',
  },
  changelogV11Feature3: {
    id: 'changelog.v1-1.feature.3',
    defaultMessage: 'Import your library directly from Hardcover or Goodreads.',
  },

  // v1.0
  changelogV10Date: {
    id: 'changelog.v1-0.date',
    defaultMessage: 'March 2026',
  },
  changelogV10Title: {
    id: 'changelog.v1-0.title',
    defaultMessage: 'Initial Release',
  },
  changelogV10Intro: {
    id: 'changelog.v1-0.intro',
    defaultMessage:
      'In this 1.0, we are proud to release the following features:',
  },
  changelogV10Feature1: {
    id: 'changelog.v1-0.feature.1',
    defaultMessage: 'Rate and update your progress on any book.',
  },
  changelogV10Feature2: {
    id: 'changelog.v1-0.feature.2',
    defaultMessage:
      'Watch your friends activity through a feed on the main screen.',
  },
  changelogV10Feature3: {
    id: 'changelog.v1-0.feature.3',
    defaultMessage:
      'Highlight your favourite 5 books on the Hall of Fame, along with your favourite book quote.',
  },
  changelogV10Feature4: {
    id: 'changelog.v1-0.feature.4',
    defaultMessage: 'Check your stats.',
  },
  changelogV10Feature5: {
    id: 'changelog.v1-0.feature.5',
    defaultMessage: 'Complete integration with GY Accounts.',
  },

  // ── Translation banner ────────────────────────────────────────────────────
  translationBannerTitle: {
    id: 'translation.banner.title',
    defaultMessage: 'Translations in progress',
  },
  translationBannerMessage: {
    id: 'translation.banner.message',
    defaultMessage:
      "We're actively working on translating the app. If something doesn't look right, English is the default fallback language.",
  },
});

export default appMessages;
