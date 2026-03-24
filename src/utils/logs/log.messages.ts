/**
 * Descriptive, domain-specific log messages.
 *
 * Naming convention:  DOMAIN_ACTION(_RESULT)
 *   - DOMAIN  → the bounded context (SESSION, BOOK, PROFILE, FRIEND, ACTIVITY, HALLOFFAME, HARDCOVER, CONFIG)
 *   - ACTION  → what happened (RETRIEVED, UPDATED, DELETED, SEARCHED, …)
 *   - RESULT  → optional qualifier (SUCCESS, FAILED, NOT_FOUND)
 */
export enum LogMessage {
  // ── Session ──
  SESSION_RETRIEVED = 'Session retrieved [{id}]',
  SESSION_NOT_FOUND = 'No active session found',

  // ── Config ──
  CONFIG_GY_API_MISSING = 'GY_API environment variable is not defined',
  CONFIG_MONGO_URI_MISSING = 'MONGO_URI environment variable is not defined',
  CONFIG_HARDCOVER_CREDENTIALS_MISSING = 'Hardcover API credentials are missing',

  // ── Book ──
  BOOK_RETRIEVED = 'The book [{id}] has been retrieved',
  BOOK_NOT_FOUND = 'Book not found',
  BOOK_RETRIEVE_FAILED = 'The book [{id}] could not be retrieved',
  BOOK_UPDATED = 'The book [{id}] has been updated',
  BOOK_UPDATE_FAILED = 'The book [{id}] could not be updated',
  BOOK_DELETED = 'The book [{id}] has been deleted',
  BOOK_DELETE_FAILED = 'The book [{id}] could not be deleted',
  BOOK_LIST_RETRIEVED = 'Book list retrieved',
  BOOK_LIST_RETRIEVE_FAILED = 'Book list could not be retrieved',

  // ── Profile ──
  PROFILE_RETRIEVED = 'Profile retrieved',
  PROFILE_RETRIEVE_FAILED = 'Profile could not be retrieved',
  PROFILE_NOT_FOUND = 'Profile not found',
  PROFILE_SEARCH_SUCCESS = 'Profile search completed',
  PROFILE_SEARCH_FAILED = 'Profile search failed',
  PROFILE_BATCH_RETRIEVED = 'Profile batch retrieved',
  PROFILE_BATCH_FAILED = 'Profile batch retrieval failed',

  // ── Biography ──
  BIOGRAPHY_UPDATED = 'Biography updated',
  BIOGRAPHY_UPDATE_FAILED = 'Biography could not be updated',

  // ── User ──
  USER_RETRIEVED = 'User retrieved',
  USER_RETRIEVE_FAILED = 'User could not be retrieved',
  USER_NOT_FOUND = 'User not found in database',

  // ── Friends ──
  FRIEND_LIST_RETRIEVED = 'Friend list retrieved',
  FRIEND_LIST_RETRIEVE_FAILED = 'Friend list could not be retrieved',
  FRIEND_DELETED = 'Friend removed',
  FRIEND_DELETE_FAILED = 'Friend could not be removed',
  FRIEND_REQUEST_SENT = 'Friend request sent',
  FRIEND_REQUEST_SEND_FAILED = 'Friend request could not be sent',
  FRIEND_REQUEST_LIST_RETRIEVED = 'Friend request list retrieved',
  FRIEND_REQUEST_LIST_FAILED = 'Friend request list could not be retrieved',
  FRIEND_REQUEST_MANAGED = 'Friend request managed',
  FRIEND_REQUEST_MANAGE_FAILED = 'Friend request management failed',

  // ── Activity ──
  ACTIVITY_LIST_RETRIEVED = 'Activity list retrieved',
  ACTIVITY_LIST_RETRIEVE_FAILED = 'Activity list could not be retrieved',
  ACTIVITY_CREATED = 'Activity created',
  ACTIVITY_CREATE_FAILED = 'Activity could not be created',
  ACTIVITY_LIKE_TOGGLED = 'Activity like toggled',
  ACTIVITY_LIKE_TOGGLE_FAILED = 'Activity like toggle failed',

  // ── Hall of Fame ──
  HALLOFFAME_RETRIEVED = 'Hall of Fame retrieved',
  HALLOFFAME_RETRIEVE_FAILED = 'Hall of Fame could not be retrieved',
  HALLOFFAME_QUOTE_UPDATED = 'Hall of Fame quote updated',
  HALLOFFAME_QUOTE_UPDATE_FAILED = 'Hall of Fame quote could not be updated',
  HALLOFFAME_BOOK_ADDED = 'Book added to Hall of Fame',
  HALLOFFAME_BOOK_ADD_FAILED = 'Book could not be added to Hall of Fame',
  HALLOFFAME_BOOK_REMOVED = 'Book removed from Hall of Fame',
  HALLOFFAME_BOOK_REMOVE_FAILED = 'Book could not be removed from Hall of Fame',

  // ── Hardcover ──
  HARDCOVER_BOOK_RETRIEVED = 'Hardcover book [{id}] retrieved',
  HARDCOVER_BOOK_RETRIEVE_FAILED = 'Hardcover book [{id}] could not be retrieved',
  HARDCOVER_BOOK_NOT_FOUND = 'Hardcover book not found',
  HARDCOVER_BOOKS_SEARCHED = 'Hardcover book search completed',
  HARDCOVER_BOOKS_SEARCH_FAILED = 'Hardcover book search failed',
  HARDCOVER_AUTHOR_RETRIEVED = 'Hardcover author retrieved',
  HARDCOVER_AUTHOR_RETRIEVE_FAILED = 'Hardcover author could not be retrieved',
  HARDCOVER_AUTHOR_NOT_FOUND = 'Hardcover author not found',
  HARDCOVER_AUTHORS_SEARCHED = 'Hardcover author search completed',
  HARDCOVER_AUTHORS_SEARCH_FAILED = 'Hardcover author search failed',

  // ── Generic ──
  METHOD_NOT_ALLOWED = 'Method not allowed',
  UNKNOWN_ERROR = 'Unknown error',
}
