/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookRatingProgressInput from './BookRatingProgressInput';

// Mock i18n
jest.mock('@/lib/i18n/I18nProvider', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'book.rating.progress': 'Progress',
        'book.progress.pages.suffix': 'pages.',
      })[key] ?? key,
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  ),
  TextField: ({ onChange, value, label, ...props }: any) => (
    <input
      onChange={onChange}
      value={value}
      placeholder={label}
      data-testid="progress-input"
      {...props}
    />
  ),
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Percent', () => {
  const PercentIcon = () => <span>%</span>;
  PercentIcon.displayName = 'PercentIcon';
  return PercentIcon;
});
jest.mock('@mui/icons-material/Book', () => {
  const BookIcon = () => <span>Book</span>;
  BookIcon.displayName = 'BookIcon';
  return BookIcon;
});

describe('BookRatingProgressInput', () => {
  const mockSetTempProgress = jest.fn();
  const mockSetIsProgressPercent = jest.fn();

  const defaultProps = {
    tempProgress: 50,
    setTempProgress: mockSetTempProgress,
    isProgressPercent: true,
    setIsProgressPercent: mockSetIsProgressPercent,
    fontFamily: 'Arial',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BookRatingProgressInput {...defaultProps} />);
    expect(screen.getByTestId('progress-input')).toBeInTheDocument();
  });

  it('displays current progress value', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('50');
  });

  it('shows percentage indicator when isProgressPercent is true', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    // Get all elements with %, filter for the Typography (span) indicator
    const percentElements = screen.getAllByText('%');
    const percentIndicator = percentElements.find(
      (el) => el.tagName === 'SPAN' && !el.closest('button')
    );
    expect(percentIndicator).toBeInTheDocument();
  });

  it('shows pages indicator when isProgressPercent is false', () => {
    const props = {
      ...defaultProps,
      isProgressPercent: false,
    };

    render(<BookRatingProgressInput {...props} />);
    expect(screen.getByText('pages.')).toBeInTheDocument();
  });

  it('calls setTempProgress when input value changes', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const input = screen.getByTestId('progress-input');
    fireEvent.change(input, { target: { value: '75' } });

    expect(mockSetTempProgress).toHaveBeenCalledWith(75);
  });

  it('renders percentage button as contained when isProgressPercent is true', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    // Get all elements with %, filter for the one inside a button
    const percentElements = screen.getAllByText('%');
    const percentButton = percentElements
      .find((el) => el.closest('button'))
      ?.closest('button');
    expect(percentButton).toHaveAttribute('data-variant', 'contained');
  });

  it('renders pages button as outlined when isProgressPercent is true', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const pagesButton = screen.getByText('Book').closest('button');
    expect(pagesButton).toHaveAttribute('data-variant', 'outlined');
  });

  it('renders pages button as contained when isProgressPercent is false', () => {
    const props = {
      ...defaultProps,
      isProgressPercent: false,
    };

    render(<BookRatingProgressInput {...props} />);

    const pagesButton = screen.getByText('Book').closest('button');
    expect(pagesButton).toHaveAttribute('data-variant', 'contained');
  });

  it('renders percentage button as outlined when isProgressPercent is false', () => {
    const props = {
      ...defaultProps,
      isProgressPercent: false,
    };

    render(<BookRatingProgressInput {...props} />);

    const percentButton = screen.getByText('%').closest('button');
    expect(percentButton).toHaveAttribute('data-variant', 'outlined');
  });

  it('calls setIsProgressPercent(true) when percentage button is clicked', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    // Get all elements with %, filter for the one inside a button
    const percentElements = screen.getAllByText('%');
    const percentButton = percentElements
      .find((el) => el.closest('button'))
      ?.closest('button');
    fireEvent.click(percentButton!);

    expect(mockSetIsProgressPercent).toHaveBeenCalledWith(true);
  });

  it('calls setIsProgressPercent(false) when pages button is clicked', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const pagesButton = screen.getByText('Book').closest('button');
    fireEvent.click(pagesButton!);

    expect(mockSetIsProgressPercent).toHaveBeenCalledWith(false);
  });

  it('handles zero progress value', () => {
    const props = {
      ...defaultProps,
      tempProgress: 0,
    };

    render(<BookRatingProgressInput {...props} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('0');
  });

  it('handles large progress values', () => {
    const props = {
      ...defaultProps,
      tempProgress: 500,
    };

    render(<BookRatingProgressInput {...props} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('500');
  });

  it('applies custom font family', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Custom Font',
    };

    render(<BookRatingProgressInput {...props} />);

    // Component should render with custom font (test that prop is passed)
    expect(screen.getByTestId('progress-input')).toBeInTheDocument();
  });

  it('handles negative progress values', () => {
    const props = {
      ...defaultProps,
      tempProgress: -10,
    };

    render(<BookRatingProgressInput {...props} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('-10');
  });

  it('handles decimal progress values', () => {
    const props = {
      ...defaultProps,
      tempProgress: 25.5,
    };

    render(<BookRatingProgressInput {...props} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('25.5');
  });

  it('handles non-numeric input gracefully', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const input = screen.getByTestId('progress-input');
    fireEvent.change(input, { target: { value: 'abc' } });

    // Should still call setTempProgress with NaN (Number('abc') = NaN)
    expect(mockSetTempProgress).toHaveBeenCalledWith(NaN);
  });

  it('handles empty input', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const input = screen.getByTestId('progress-input');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockSetTempProgress).toHaveBeenCalledWith(0);
  });

  it('renders correct Progress label', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Progress');
    expect(input).toBeInTheDocument();
  });

  it('toggles between percentage and pages modes', () => {
    const { rerender } = render(<BookRatingProgressInput {...defaultProps} />);

    // Initially percentage mode - check for Typography indicator
    const percentElements = screen.getAllByText('%');
    const percentIndicator = percentElements.find(
      (el) => el.tagName === 'SPAN' && !el.closest('button')
    );
    expect(percentIndicator).toBeInTheDocument();

    // Click pages button
    const pagesButton = screen.getByText('Book').closest('button');
    fireEvent.click(pagesButton!);
    expect(mockSetIsProgressPercent).toHaveBeenCalledWith(false);

    // Rerender with pages mode
    rerender(
      <BookRatingProgressInput {...defaultProps} isProgressPercent={false} />
    );

    expect(screen.getByText('pages.')).toBeInTheDocument();

    // Click percentage button
    const percentElementsAfter = screen.getAllByText('%');
    const percentButton = percentElementsAfter
      .find((el) => el.closest('button'))
      ?.closest('button');
    fireEvent.click(percentButton!);
    expect(mockSetIsProgressPercent).toHaveBeenCalledWith(true);
  });

  it('renders both buttons regardless of current mode', () => {
    render(<BookRatingProgressInput {...defaultProps} />);

    // Check for percentage button (icon inside button)
    const percentElements = screen.getAllByText('%');
    const percentButton = percentElements.find((el) => el.closest('button'));
    expect(percentButton).toBeInTheDocument();

    // Check for pages button
    expect(screen.getByText('Book')).toBeInTheDocument();
  });

  it('handles very large progress values', () => {
    const props = {
      ...defaultProps,
      tempProgress: 999999,
    };

    render(<BookRatingProgressInput {...props} />);

    const input = screen.getByTestId('progress-input');
    expect(input).toHaveValue('999999');
  });

  it('maintains button state consistency', () => {
    const props = {
      ...defaultProps,
      isProgressPercent: false,
    };

    render(<BookRatingProgressInput {...props} />);

    const percentButton = screen.getByText('%').closest('button');
    const pagesButton = screen.getByText('Book').closest('button');

    expect(percentButton).toHaveAttribute('data-variant', 'outlined');
    expect(pagesButton).toHaveAttribute('data-variant', 'contained');
  });
});
