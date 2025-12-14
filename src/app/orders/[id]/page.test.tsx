import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import OrderDetailPage from './page';

const pushMock = jest.fn();
const mockDispatch = jest.fn();
const mockFetchOrderById = jest.fn();
const mockUpdateOrderStatus = jest.fn();
const mockClearSelectedOrder = jest.fn();
let mockState: unknown;

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
    useParams: () => ({ id: '1' }),
  };
});

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) => selector(mockState),
}));

jest.mock('@/features/orders/orderSlice', () => ({
  __esModule: true,
  fetchOrderById: (...args: unknown[]) => mockFetchOrderById(...args),
  updateOrderStatus: (...args: unknown[]) => mockUpdateOrderStatus(...args),
  clearSelectedOrder: (...args: unknown[]) => mockClearSelectedOrder(...args),
}));

jest.mock('@/components/layout/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

jest.mock('@/components/ui/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const baseOrder = {
  id: 1,
  orderId: 'ORD-001',
  customerName: 'Alice',
  status: 'PENDING' as const,
  total: 150.5,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  items: [
    {
      id: 10,
      orderId: 1,
      productId: 1,
      quantity: 2,
      price: 50.25,
      product: {
        id: 1,
        name: 'Product A',
        image: null,
      },
    },
  ],
};

describe('OrderDetailPage', () => {
  beforeEach(() => {
    mockState = {
      orders: {
        selectedOrder: baseOrder,
        loading: false,
      },
    };

    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return { unwrap: jest.fn().mockResolvedValue({}) };
      }
      return action;
    });

    mockFetchOrderById.mockImplementation(() => jest.fn());
    mockUpdateOrderStatus.mockImplementation(() => jest.fn());
    mockClearSelectedOrder.mockImplementation(() => ({ type: 'orders/clearSelectedOrder' }));

    mockDispatch.mockClear();
    mockFetchOrderById.mockClear();
    mockUpdateOrderStatus.mockClear();
    mockClearSelectedOrder.mockClear();
    pushMock.mockClear();
  });

  it('shows loading while fetching', () => {
    mockState = { orders: { selectedOrder: null, loading: true } };
    render(<OrderDetailPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders order details and allows navigation back', async () => {
    render(<OrderDetailPage />);

    expect(mockFetchOrderById).toHaveBeenCalledWith(1);
    expect(screen.getByText(/Order ORD-001/)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getAllByText('$150.50').length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /back to orders/i }));
    expect(pushMock).toHaveBeenCalledWith('/orders');
  });

  it('updates order status from quick actions with confirmation', async () => {
    render(<OrderDetailPage />);
    mockUpdateOrderStatus.mockClear();

    await userEvent.click(screen.getByRole('button', { name: /mark as shipped/i }));
    await userEvent.click(screen.getByRole('button', { name: /update status/i }));

    expect(mockUpdateOrderStatus).toHaveBeenCalledWith({ id: 1, status: 'SHIPPED' });
  });

  it('clears selected order on unmount', () => {
    const { unmount } = render(<OrderDetailPage />);
    unmount();
    expect(mockClearSelectedOrder).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'orders/clearSelectedOrder' })
    );
  });
});
