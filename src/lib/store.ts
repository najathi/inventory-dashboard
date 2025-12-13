import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@/features/products/productSlice';
import orderReducer from '@/features/orders/orderSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      orders: orderReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['products/fetchProducts/fulfilled', 'orders/fetchOrders/fulfilled'],
          ignoredPaths: ['products.items', 'orders.items'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];