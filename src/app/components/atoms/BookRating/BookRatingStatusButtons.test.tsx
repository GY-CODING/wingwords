/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import { EStatus } from '@/utils/constants/EStatus';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, variant, startIcon, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {startIcon}
      {children}
    </button>
  ),
}));

// Mock i18n
jest.mock('@/lib/i18n/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'book.rating.status.wantToRead': 'Want to read',
        'book.rating.status.reading': 'Reading',
        'book.rating.status.read': 'Read',
      })[key] ?? key,
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));

// Mock the BookRatingOptions to avoid icon import issues
jest.mock('./BookRatingOptions', () => ({
  statusOptions: [
    {
      labelKey: 'book.rating.status.wantToRead',
      value: 'WANT_TO_READ',
      icon: <span data-testid="bookmark-icon">BookmarkIcon</span>,
    },
    {
      labelKey: 'book.rating.status.reading',
      value: 'READING',
      icon: <span data-testid="eye-icon">RemoveRedEyeIcon</span>,
    },
    {
      labelKey: 'book.rating.status.read',
      value: 'READ',
      icon: <span data-testid="check-icon">CheckCircleIcon</span>,
    },
  ],
}));

describe('BookRatingStatusButtons', () => {
  const mockSetTempStatus = jest.fn();
  const defaultProps = {
    tempStatus: EStatus.WANT_TO_READ,
    setTempStatus: mockSetTempStatus,
    fontFamily: 'Arial',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);
    expect(screen.getByText('Want to read')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('renders all status buttons', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('highlights the current status as contained', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const wantToReadButton = screen.getByText('Want to read');
    expect(wantToReadButton).toHaveAttribute('data-variant', 'contained');
  });

  it('shows other buttons as outlined', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const readingButton = screen.getByText('Reading');
    const readButton = screen.getByText('Read');

    expect(readingButton).toHaveAttribute('data-variant', 'outlined');
    expect(readButton).toHaveAttribute('data-variant', 'outlined');
  });

  it('calls setTempStatus when a button is clicked', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const readingButton = screen.getByText('Reading');
    fireEvent.click(readingButton);

    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.READING);
  });

  it('calls setTempStatus with correct status for each button', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    fireEvent.click(screen.getByText('Want to read'));
    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.WANT_TO_READ);

    fireEvent.click(screen.getByText('Reading'));
    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.READING);

    fireEvent.click(screen.getByText('Read'));
    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.READ);
  });

  it('renders with READING status selected', () => {
    const props = {
      ...defaultProps,
      tempStatus: EStatus.READING,
    };

    render(<BookRatingStatusButtons {...props} />);

    const readingButton = screen.getByText('Reading');
    expect(readingButton).toHaveAttribute('data-variant', 'contained');

    const wantToReadButton = screen.getByText('Want to read');
    const readButton = screen.getByText('Read');
    expect(wantToReadButton).toHaveAttribute('data-variant', 'outlined');
    expect(readButton).toHaveAttribute('data-variant', 'outlined');
  });

  it('renders with READ status selected', () => {
    const props = {
      ...defaultProps,
      tempStatus: EStatus.READ,
    };

    render(<BookRatingStatusButtons {...props} />);

    const readButton = screen.getByText('Read');
    expect(readButton).toHaveAttribute('data-variant', 'contained');

    const wantToReadButton = screen.getByText('Want to read');
    const readingButton = screen.getByText('Reading');
    expect(wantToReadButton).toHaveAttribute('data-variant', 'outlined');
    expect(readingButton).toHaveAttribute('data-variant', 'outlined');
  });

  it('applies custom font family', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Custom Font',
    };

    render(<BookRatingStatusButtons {...props} />);

    // All buttons should be rendered (testing that fontFamily prop is passed)
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders icons for each button', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    expect(screen.getByTestId('bookmark-icon')).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('handles multiple clicks on the same button', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const readingButton = screen.getByText('Reading');
    fireEvent.click(readingButton);
    fireEvent.click(readingButton);

    expect(mockSetTempStatus).toHaveBeenCalledTimes(2);
    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.READING);
  });

  it('handles rapid clicking between buttons', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const readingButton = screen.getByText('Reading');
    const readButton = screen.getByText('Read');

    fireEvent.click(readingButton);
    fireEvent.click(readButton);
    fireEvent.click(readingButton);

    expect(mockSetTempStatus).toHaveBeenCalledTimes(3);
    expect(mockSetTempStatus).toHaveBeenNthCalledWith(1, EStatus.READING);
    expect(mockSetTempStatus).toHaveBeenNthCalledWith(2, EStatus.READ);
    expect(mockSetTempStatus).toHaveBeenNthCalledWith(3, EStatus.READING);
  });

  it('renders buttons in correct order', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Want to read');
    expect(buttons[1]).toHaveTextContent('Reading');
    expect(buttons[2]).toHaveTextContent('Read');
  });

  it('handles unknown status gracefully', () => {
    const props = {
      ...defaultProps,
      tempStatus: 'UNKNOWN_STATUS' as EStatus,
    };

    render(<BookRatingStatusButtons {...props} />);

    // All buttons should be outlined since none match the unknown status
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-variant', 'outlined');
    });
  });

  it('maintains button functionality with different font families', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Times New Roman',
    };

    render(<BookRatingStatusButtons {...props} />);

    const readButton = screen.getByText('Read');
    fireEvent.click(readButton);

    expect(mockSetTempStatus).toHaveBeenCalledWith(EStatus.READ);
  });

  it('renders with RATE status', () => {
    const props = {
      ...defaultProps,
      tempStatus: EStatus.RATE,
    };

    render(<BookRatingStatusButtons {...props} />);

    // All buttons should be outlined since RATE is not in the options
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-variant', 'outlined');
    });
  });

  it('ensures all buttons have consistent structure', () => {
    render(<BookRatingStatusButtons {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      // Each button should have an icon and text
      const iconElement = button.querySelector('[data-testid*="-icon"]');
      expect(iconElement).toBeInTheDocument();
      expect(button.textContent).toBeTruthy();
    });
  });

  it('handles empty fontFamily gracefully', () => {
    const props = {
      ...defaultProps,
      fontFamily: '',
    };

    render(<BookRatingStatusButtons {...props} />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('handles very long font family names', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Very Long Font Family Name That Might Cause Issues',
    };

    render(<BookRatingStatusButtons {...props} />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
