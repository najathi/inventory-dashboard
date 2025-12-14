import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ProductDetailPage from './page';

const pushMock = jest.fn();
const mockDispatch = jest.fn();
const mockFetchProductById = jest.fn();
const mockUpdateProduct = jest.fn();
const mockClearSelectedProduct = jest.fn();
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

jest.mock('@/features/products/productSlice', () => ({
  __esModule: true,
  fetchProductById: (...args: unknown[]) => mockFetchProductById(...args),
  updateProduct: (...args: unknown[]) => mockUpdateProduct(...args),
  clearSelectedProduct: (...args: unknown[]) => mockClearSelectedProduct(...args),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('next/image', () => (props: any) => {
  const { alt, src, fill, ...rest } = props;
  return <img alt={alt} src={typeof src === 'string' ? src : ''} {...rest} />;
});

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

jest.mock('@/components/products/ProductForm', () => ({
  __esModule: true,
  default: (props: {
    product: unknown;
    onSubmit: (data: any) => Promise<void>;
    onCancel?: () => void;
  }) => (
    <div data-testid="product-form">
      <span>Mock Product Form</span>
      <button onClick={() => props.onSubmit({ name: 'Updated Name' })}>Submit Update</button>
      {props.onCancel && <button onClick={props.onCancel}>Cancel</button>}
    </div>
  ),
}));

const baseProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  category: 'Electronics',
  price: 199.99,
  stock: 15,
  rating: 4.5,
  image: null,
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-02-01'),
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    mockState = {
      products: {
        selectedProduct: baseProduct,
        loading: false,
      },
    };

    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return { unwrap: jest.fn().mockResolvedValue({}) };
      }
      return action;
    });

    mockFetchProductById.mockImplementation(() => jest.fn());
    mockUpdateProduct.mockImplementation(() => jest.fn());
    mockClearSelectedProduct.mockImplementation(() => ({ type: 'products/clearSelectedProduct' }));

    mockDispatch.mockClear();
    mockFetchProductById.mockClear();
    mockUpdateProduct.mockClear();
    mockClearSelectedProduct.mockClear();
    pushMock.mockClear();
  });

  it('shows loading state when product is still fetching', () => {
    mockState = { products: { selectedProduct: null, loading: true } };

    render(<ProductDetailPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders product details and allows navigating back', async () => {
    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(mockFetchProductById).toHaveBeenCalledWith(1);
    });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
    expect(screen.getByText(/4\.5\s*\/\s*5\.0/)).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back to products/i }));
    expect(pushMock).toHaveBeenCalledWith('/products');
  });

  it('switches to edit mode and submits an update', async () => {
    render(<ProductDetailPage />);

    await userEvent.click(screen.getByRole('button', { name: /edit product/i }));
    expect(screen.getByTestId('product-form')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Submit Update'));

    expect(mockUpdateProduct).toHaveBeenCalledWith({ id: 1, data: { name: 'Updated Name' } });
    await waitFor(() => {
      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument();
    });
  });

  it('clears selected product when unmounted', () => {
    const { unmount } = render(<ProductDetailPage />);

    unmount();

    expect(mockClearSelectedProduct).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'products/clearSelectedProduct' }));
  });
});
