/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FriendRequest from './FriendRequest';
import { ECommands } from '@/utils/constants/ECommands';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    style,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    style: React.CSSProperties;
    [key: string]: unknown;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      data-testid="user-image"
      {...props}
    />
  ),
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({
    children,
    component,
    href,
    sx,
    ...props
  }: {
    children: React.ReactNode;
    component?: string;
    href?: string;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => {
    const Element = component || 'div';
    return React.createElement(
      Element,
      {
        'data-testid': 'request-card',
        href,
        ...props,
      },
      children
    );
  },
  IconButton: ({
    children,
    onClick,
    disabled,
    sx,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <button
      data-testid="action-button"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
  Typography: ({
    children,
    sx,
    ...props
  }: {
    children: React.ReactNode;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <span data-testid="user-username" {...props}>
      {children}
    </span>
  ),
  CircularProgress: () => <span data-testid="loading-spinner" />,
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Check', () => ({
  __esModule: true,
  default: () => <span data-testid="check-icon">✔️</span>,
}));
jest.mock('@mui/icons-material/Close', () => ({
  __esModule: true,
  default: () => <span data-testid="close-icon">❌</span>,
}));

describe('FriendRequest', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000' as const,
    username: 'testuser',
    phoneNumber: '+1234567890',
    picture: 'https://example.com/avatar.jpg',
  };
  const mockRequestId = 'req-001';
  const mockHandleManageRequest = jest.fn();
  const mockIsLoadingManageRequest = jest.fn(() => false);

  beforeEach(() => {
    mockHandleManageRequest.mockReset();
    mockIsLoadingManageRequest.mockReset();
    mockIsLoadingManageRequest.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    it('renders without crashing with required props', () => {
      expect(() =>
        render(
          <FriendRequest
            user={mockUser}
            handleManageRequest={mockHandleManageRequest}
            isLoadingManageRequest={mockIsLoadingManageRequest}
            requestId={mockRequestId}
          />
        )
      ).not.toThrow();
    });

    it('renders user username correctly', () => {
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('renders user image with correct props', () => {
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      const image = screen.getByTestId('user-image');
      expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(image).toHaveAttribute('alt', 'testuser');
    });
  });

  describe('Action Buttons', () => {
    it('renders accept and deny buttons', () => {
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      const buttons = screen.getAllByTestId('action-button');
      expect(buttons.length).toBe(2);
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('calls handleManageRequest with ACCEPT when accept button is clicked', () => {
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      const buttons = screen.getAllByTestId('action-button');
      fireEvent.click(buttons[0]);
      expect(mockHandleManageRequest).toHaveBeenCalledWith(
        mockRequestId,
        ECommands.ACCEPT
      );
    });

    it('calls handleManageRequest with DENY when deny button is clicked', () => {
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      const buttons = screen.getAllByTestId('action-button');
      fireEvent.click(buttons[1]);
      expect(mockHandleManageRequest).toHaveBeenCalledWith(
        mockRequestId,
        ECommands.DENY
      );
    });

    it('shows loading spinner instead of buttons when loading', () => {
      mockIsLoadingManageRequest.mockReturnValue(true);
      render(
        <FriendRequest
          user={mockUser}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryAllByTestId('action-button')).toHaveLength(0);
    });
  });

  describe('Null User', () => {
    it('renders empty username and image when user is null', () => {
      render(
        <FriendRequest
          user={null}
          handleManageRequest={mockHandleManageRequest}
          isLoadingManageRequest={mockIsLoadingManageRequest}
          requestId={mockRequestId}
        />
      );
      const image = screen.getByTestId('user-image');
      expect(image).toHaveAttribute('src', '');
      expect(image).toHaveAttribute('alt', '');
    });
  });
});
