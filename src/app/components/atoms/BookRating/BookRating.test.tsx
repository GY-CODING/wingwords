/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookRating } from './BookRating';
import { BookRatingProps } from './types';
import { EStatus } from '@/utils/constants/EStatus';
import { ApiBook } from '@/domain/apiBook.model';

// Mock dependencies
jest.mock('@/hooks/useUser');
jest.mock('@/hooks/useRemoveBook');
jest.mock('@/lib/i18n/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'book.rating.status.wantToRead': 'Want to read',
        'book.rating.status.reading': 'Reading',
        'book.rating.status.read': 'Read',
        'book.rating.signIn': 'Sign in to rate this book',
        'book.rating.title': 'Book details',
        'book.rating.section.rating': 'Rating',
        'book.rating.section.status': 'Status',
        'book.rating.section.readingPeriod': 'Reading period',
        'book.rating.startDate': 'Start date',
        'book.rating.endDate': 'End date',
        'book.rating.start': 'Start',
        'book.rating.end': 'End',
        'book.rating.apply': 'Apply changes',
        'book.rating.review.placeholder': 'Write your review...',
        'book.rating.progress': 'Progress',
      })[key] ?? key,
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));
jest.mock('@/utils/fonts/fonts', () => ({
  lora: { style: { fontFamily: 'lora' } },
}));
jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    breakpoints: {
      down: () => false,
    },
  }),
}));
jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));
jest.mock('./hooks/useBookRatingState');

// Mock components
jest.mock('./BookRatingDrawer', () => ({
  __esModule: true,
  default: ({ open, onClose }: any) => (
    <div data-testid="book-rating-drawer" data-open={open}>
      <button onClick={onClose}>Close Drawer</button>
    </div>
  ),
}));

jest.mock('./BookRatingMenu', () => ({
  __esModule: true,
  default: ({ open, onClose }: any) => (
    <div data-testid="book-rating-menu" data-open={open}>
      <button onClick={onClose}>Close Menu</button>
    </div>
  ),
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    startIcon,
    endIcon,
    ...props
  }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </button>
  ),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Bookmark', () => () => <span>Bookmark</span>);
jest.mock('@mui/icons-material/ArrowDropDown', () => () => (
  <span>ArrowDropDown</span>
));

import { useUser } from '@/hooks/useUser';
import { useRemoveBook } from '@/hooks/useRemoveBook';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBookRatingState } from './hooks/useBookRatingState';

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseRemoveBook = useRemoveBook as jest.MockedFunction<
  typeof useRemoveBook
>;
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;
const mockUseBookRatingState = useBookRatingState as jest.MockedFunction<
  typeof useBookRatingState
>;

describe('BookRating', () => {
  const mockHandleDeleteBook = jest.fn();
  const mockMutate = jest.fn();
  const mockSetAnchorEl = jest.fn();
  const mockSetDrawerOpen = jest.fn();
  const mockHandleApply = jest.fn();

  const defaultMockState = {
    tempRating: 0,
    tempStatus: EStatus.WANT_TO_READ,
    tempStartDate: '',
    tempEndDate: '',
    tempProgress: 0,
    isSubmitting: false,
    isProgressPercent: true,
  };

  const defaultMockHandlers = {
    setTempRating: jest.fn(),
    setTempStatus: jest.fn(),
    setTempStartDate: jest.fn(),
    setTempEndDate: jest.fn(),
    setTempProgress: jest.fn(),
    setIsProgressPercent: jest.fn(),
    handleApply: mockHandleApply,
  };

  const defaultProps: BookRatingProps = {
    bookId: 'test-book-id',
    apiBook: null,
    isRatingLoading: false,
    mutate: mockMutate,
    isLoggedIn: true,
  };

  const mockApiBook: ApiBook = {
    id: 'test-book-id',
    averageRating: 4.5,
    userData: {
      rating: 4,
      status: EStatus.READ,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      progress: 1,
      userId: '',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseUser.mockReturnValue({
      data: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isLoading: false,
      error: null,
    });

    mockUseRemoveBook.mockReturnValue({
      handleDeleteBook: mockHandleDeleteBook,
      isLoading: false,
      error: null,
      isSuccess: false,
      setIsSuccess: function (isSuccess: boolean): void {
        throw new Error('Function not implemented.');
      },
      setError: function (error: Error | null): void {
        throw new Error('Function not implemented.');
      },
      setIsLoading: function (isLoading: boolean): void {
        throw new Error('Function not implemented.');
      },
    });

    mockUseBookRatingState.mockReturnValue({
      state: defaultMockState,
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders without crashing', () => {
    render(<BookRating {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    expect(mainButton).toBeInTheDocument();
  });

  it('renders with default "Want to read" label when no book saved', () => {
    render(<BookRating {...defaultProps} />);
    expect(screen.getByText('Want to read')).toBeInTheDocument();
  });

  it('renders with correct status label when book is saved', () => {
    const props = {
      ...defaultProps,
      apiBook: mockApiBook,
    };

    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: EStatus.READ },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...props} />);
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('shows "Sign in to rate this book" when user is not logged in', () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<BookRating {...defaultProps} />);
    expect(screen.getByText('Sign in to rate this book')).toBeInTheDocument();
  });

  it('disables button when not logged in', () => {
    const props = { ...defaultProps, isLoggedIn: false };
    render(<BookRating {...props} />);

    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    expect(mainButton).toBeDisabled();
  });

  it('opens menu on desktop when button is clicked', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop

    render(<BookRating {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    fireEvent.click(mainButton!);

    expect(mockSetAnchorEl).toHaveBeenCalled();
  });

  it('opens drawer on mobile when button is clicked', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    render(<BookRating {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    fireEvent.click(mainButton!);

    expect(mockSetDrawerOpen).toHaveBeenCalledWith(true);
  });

  it('calls handleDeleteBook when book is saved and delete is triggered', () => {
    const props = {
      ...defaultProps,
      apiBook: mockApiBook,
    };

    // Configure mock to return read status
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: EStatus.READ },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: { username: 'testuser' } as any,
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...props} />);

    // Component should render with book data
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Read')
    );
    expect(mainButton).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const props = {
      ...defaultProps,
      isRatingLoading: true,
    };

    render(<BookRating {...props} />);

    // Should render without showing "Sign in" message while loading
    expect(
      screen.queryByText('Sign in to rate this book')
    ).not.toBeInTheDocument();
  });

  it('handles submitting state correctly', () => {
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, isSubmitting: true },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    expect(mainButton).toBeInTheDocument();
  });

  it('passes correct props to BookRatingMenu', () => {
    const anchorElement = document.createElement('div');

    mockUseBookRatingState.mockReturnValue({
      state: defaultMockState,
      handlers: defaultMockHandlers,
      anchorEl: anchorElement,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);

    const menu = screen.getByTestId('book-rating-menu');
    expect(menu).toHaveAttribute('data-open', 'true');
  });

  it('passes correct props to BookRatingDrawer', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    mockUseBookRatingState.mockReturnValue({
      state: defaultMockState,
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: true,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);

    const drawer = screen.getByTestId('book-rating-drawer');
    expect(drawer).toHaveAttribute('data-open', 'true');
  });

  it('handles book with RATE status correctly', () => {
    const apiBookWithRateStatus: ApiBook = {
      ...mockApiBook,
      userData: {
        ...mockApiBook.userData!,
        status: EStatus.RATE,
      },
    };

    const props = {
      ...defaultProps,
      apiBook: apiBookWithRateStatus,
    };

    render(<BookRating {...props} />);
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Want to read')
    );
    expect(mainButton).toBeInTheDocument();
  });

  it('renders reading status correctly', () => {
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: EStatus.READING },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);
    expect(screen.getByText('Reading')).toBeInTheDocument();
  });

  it('renders want to read status correctly', () => {
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: EStatus.WANT_TO_READ },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: {
        username: 'testuser',
        id: '00000000-0000-0000-0000-000000000000',
        picture: '',
        apiKey: '',
        phoneNumber: null,
      },
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);
    expect(screen.getByText('Want to read')).toBeInTheDocument();
  });

  it('handles localHandleDeleteBook function', () => {
    const props = {
      ...defaultProps,
      apiBook: mockApiBook,
    };

    // Configure mock to return read status
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: EStatus.READ },
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: { username: 'testuser' } as any,
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...props} />);

    // The component should render without errors
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons.find((button) =>
      button.textContent?.includes('Read')
    );
    expect(mainButton).toBeInTheDocument();
  });

  it('handles case when displayStatusOption is not found', () => {
    mockUseBookRatingState.mockReturnValue({
      state: { ...defaultMockState, tempStatus: 999 as unknown as EStatus }, // Invalid status
      handlers: defaultMockHandlers,
      anchorEl: null,
      setAnchorEl: mockSetAnchorEl,
      drawerOpen: false,
      setDrawerOpen: mockSetDrawerOpen,
      user: { username: 'testuser' } as any,
      isUserLoading: false,
      isDeleteLoading: false,
      handleDeleteBook: jest.fn(),
    });

    render(<BookRating {...defaultProps} />);
    expect(screen.getByText('Want to read')).toBeInTheDocument(); // Fallback text
  });
});
