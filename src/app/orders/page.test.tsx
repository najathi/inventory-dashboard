import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersPage from './page';
import { setOrderFilters } from '@/features/orders/orderSlice';

const mockDispatch = jest.fn();
let mockState: unknown;

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) => selector(mockState),
}));

jest.mock('@/lib/providers', () => ({
  useThemeMode: () => ({ mode: 'light', toggleMode: jest.fn() }),
}));

jest.mock('@/components/orders/OrderTable', () => {
  const MockOrderTable = (props: { orders: unknown[]; onFiltersChange: (filters: unknown) => void }) => {
    return (
      <div data-testid="order-table">
        Orders: {props.orders.length}
        <button onClick={() => props.onFiltersChange({ status: 'SHIPPED' })}>
          Apply Shipped Filter
        </button>
      </div>
    );
  };
  MockOrderTable.displayName = 'MockOrderTable';
  return MockOrderTable;
});

describe('OrdersPage', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return { unwrap: () => Promise.resolve() };
      }
      return action;
    });

    const baseOrder = {
      orderId: 'ORD-1',
      customerName: 'Alice',
      total: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
    };

    mockState = {
      orders: {
        items: [
          { ...baseOrder, id: 1, status: 'PENDING' },
          { ...baseOrder, id: 2, status: 'SHIPPED' },
          { ...baseOrder, id: 3, status: 'DELIVERED' },
        ],
        filters: { status: 'All', sortField: 'createdAt', sortDirection: 'desc' },
        loading: false,
        error: null,
      },
    };
  });

  it('renders order stats and passes orders to table', () => {
    render(<OrdersPage />);

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getAllByText('Orders')[0]).toBeInTheDocument();

    expect(screen.getByTestId('order-table')).toHaveTextContent('Orders: 3');
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // fetchOrders thunk
  });

  it('dispatches filter changes from the table', async () => {
    render(<OrdersPage />);
    mockDispatch.mockClear();

    await userEvent.click(screen.getByText('Apply Shipped Filter'));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: setOrderFilters.type, payload: { status: 'SHIPPED' } })
    );
  });
});
