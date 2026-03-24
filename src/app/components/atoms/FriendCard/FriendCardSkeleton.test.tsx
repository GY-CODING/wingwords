/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, screen } from '@testing-library/react';
import FriendCardSkeleton from './FriendCardSkeleton';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({
    children,
    sx,
    ...props
  }: {
    children: React.ReactNode;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div data-testid="skeleton-card" {...props}>
      {children}
    </div>
  ),
  Skeleton: ({
    variant,
    width,
    height,
    sx,
    ...props
  }: {
    variant?: string;
    width?: string | number;
    height?: number;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`skeleton-${variant || 'rectangular'}`}
      data-width={width}
      data-height={height}
      {...props}
    >
      Loading...
    </div>
  ),
}));

describe('FriendCardSkeleton', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<FriendCardSkeleton />)).not.toThrow();
    });

    it('renders the main card container', () => {
      render(<FriendCardSkeleton />);
      const cards = screen.getAllByTestId('skeleton-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('renders circular skeleton for avatar', () => {
      render(<FriendCardSkeleton />);

      const avatarSkeleton = screen.getByTestId('skeleton-circular');
      expect(avatarSkeleton).toBeInTheDocument();
      expect(avatarSkeleton).toHaveAttribute('data-width', '48');
      expect(avatarSkeleton).toHaveAttribute('data-height', '48');
    });

    it('renders text skeleton for username', () => {
      render(<FriendCardSkeleton />);

      const textSkeleton = screen.getByTestId('skeleton-text');
      expect(textSkeleton).toBeInTheDocument();
      expect(textSkeleton).toHaveAttribute('data-width', '55%');
      expect(textSkeleton).toHaveAttribute('data-height', '24');
    });
  });

  describe('Skeleton Structure', () => {
    it('has correct layout with flexbox', () => {
      render(<FriendCardSkeleton />);
      const cards = screen.getAllByTestId('skeleton-card');
      expect(cards.length).toBeGreaterThan(0);
      const circularSkeletons = screen.getAllByTestId('skeleton-circular');
      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(circularSkeletons.length).toBeGreaterThan(0);
      expect(textSkeletons.length).toBeGreaterThan(0);
    });

    it('renders all required skeleton elements', () => {
      render(<FriendCardSkeleton />);

      // Should have one circular skeleton for avatar
      const circularSkeletons = screen.getAllByTestId('skeleton-circular');
      expect(circularSkeletons).toHaveLength(1);

      // Should have one text skeleton for username
      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(textSkeletons).toHaveLength(1);
    });
  });

  describe('Styling and Dimensions', () => {
    it('avatar skeleton has correct dimensions', () => {
      render(<FriendCardSkeleton />);

      const avatarSkeleton = screen.getByTestId('skeleton-circular');
      expect(avatarSkeleton).toHaveAttribute('data-width', '48');
      expect(avatarSkeleton).toHaveAttribute('data-height', '48');
    });

    it('username skeleton has correct dimensions', () => {
      render(<FriendCardSkeleton />);

      const textSkeleton = screen.getByTestId('skeleton-text');
      expect(textSkeleton).toHaveAttribute('data-width', '55%');
      expect(textSkeleton).toHaveAttribute('data-height', '24');
    });
  });

  describe('Multiple Instances', () => {
    it('can render multiple skeleton instances', () => {
      render(
        <div>
          <FriendCardSkeleton />
          <FriendCardSkeleton />
          <FriendCardSkeleton />
        </div>
      );

      // There will be more than 3 skeleton-card divs due to nested Box mocks
      const cards = screen.getAllByTestId('skeleton-card');
      expect(cards.length).toBeGreaterThanOrEqual(3);

      const circularSkeletons = screen.getAllByTestId('skeleton-circular');
      expect(circularSkeletons).toHaveLength(3);

      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(textSkeletons).toHaveLength(3);
    });

    it('each instance is independent', () => {
      render(
        <div>
          <FriendCardSkeleton />
          <FriendCardSkeleton />
        </div>
      );
      // Just check that there are at least two skeletons of each type
      const circularSkeletons = screen.getAllByTestId('skeleton-circular');
      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(circularSkeletons.length).toBeGreaterThanOrEqual(2);
      expect(textSkeletons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('skeleton elements are present', () => {
      render(<FriendCardSkeleton />);
      const cards = screen.getAllByTestId('skeleton-card');
      const circularSkeletons = screen.getAllByTestId('skeleton-circular');
      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(cards.length).toBeGreaterThan(0);
      expect(circularSkeletons.length).toBeGreaterThan(0);
      expect(textSkeletons.length).toBeGreaterThan(0);
    });
  });
});
