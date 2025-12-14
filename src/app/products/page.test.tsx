import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from './page';
import { setPage } from '@/features/products/productSlice';

const mockDispatch = jest.fn();
let mockState: unknown;

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}));

jest.mock('@/lib/providers', () => ({
  useThemeMode: () => ({ mode: 'light', toggleMode: jest.fn() }),
}));

describe('ProductsPage pagination', () => {
  beforeEach(() => {
    mockState = {
      products: {
        items: [
          {
            id: 1,
            name: 'Product 1',
            description: null,
            category: 'Electronics',
            price: 10,
            stock: 5,
            rating: 4,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'Product 2',
            description: null,
            category: 'Electronics',
            price: 20,
            stock: 5,
            rating: 4,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            name: 'Product 3',
            description: null,
            category: 'Electronics',
            price: 30,
            stock: 5,
            rating: 4,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 4,
            name: 'Product 4',
            description: null,
            category: 'Electronics',
            price: 40,
            stock: 5,
            rating: 4,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 5,
            name: 'Product 5',
            description: null,
            category: 'Electronics',
            price: 50,
            stock: 5,
            rating: 4,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        selectedProduct: null,
        filters: { search: '', category: 'All', minPrice: 0, maxPrice: 1000 },
        loading: false,
        error: null,
        page: 2,
        itemsPerPage: 2,
      },
    };

    mockDispatch.mockClear();
    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return { unwrap: () => Promise.resolve() };
      }
      return action;
    });
    window.scrollTo = jest.fn();
  });

  it('renders paginated products and pagination controls', () => {
    render(<ProductsPage />);

    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.getByText('Product 4')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /pagination navigation/i })).toBeInTheDocument();
  });

  it('dispatches setPage when a new page is selected', async () => {
    render(<ProductsPage />);
    mockDispatch.mockClear();

    await userEvent.click(screen.getByRole('button', { name: /go to page 3/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: setPage.type, payload: 3 })
    );
  });
});
