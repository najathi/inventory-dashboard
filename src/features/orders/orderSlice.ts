import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderFilters, OrderStatus } from '@/types/order';
import * as orderService from '@/services/orderService';

interface OrderState {
  items: Order[];
  filters: OrderFilters;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  filters: {
    status: 'All',
    sortField: 'createdAt',
    sortDirection: 'desc',
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrders();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  Order,
  { id: number; status: OrderStatus },
  { rejectValue: string }
>(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(id, status);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update order status';
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch orders';
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setOrderFilters, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
