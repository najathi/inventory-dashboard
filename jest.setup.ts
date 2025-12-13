import '@testing-library/jest-dom';
import React from 'react';

// Basic mocks for Next.js navigation helpers
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    usePathname: () => '/',
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }),
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(),
  };
});

// Mock next/link to render a plain anchor for testing
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children);
  MockLink.displayName = 'MockLink';
  return MockLink;
});
