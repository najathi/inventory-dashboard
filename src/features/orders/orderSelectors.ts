import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrderFilters = (state: RootState) => state.orders.filters;
export const selectOrderLoading = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;

export const selectFilteredAndSortedOrders = createSelector(
  [selectOrders, selectOrderFilters],
  (orders, filters) => {
    // Filter by status
    let filtered = orders;
    if (filters.status !== 'All') {
      filtered = orders.filter((order) => order.status === filters.status);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      const aVal = a[filters.sortField];
      const bVal = b[filters.sortField];
      const modifier = filters.sortDirection === 'asc' ? 1 : -1;

      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }
);

export const selectOrderStats = createSelector([selectOrders], (orders) => {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };
});