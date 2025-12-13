import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductFilters = (state: RootState) => state.products.filters;
export const selectProductPage = (state: RootState) => state.products.page;
export const selectItemsPerPage = (state: RootState) => state.products.itemsPerPage;
export const selectProductLoading = (state: RootState) => state.products.loading;
export const selectProductError = (state: RootState) => state.products.error;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;

export const selectFilteredProducts = createSelector(
  [selectProducts, selectProductFilters],
  (products, filters) => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === 'All' || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }
);

export const selectPaginatedProducts = createSelector(
  [selectFilteredProducts, selectProductPage, selectItemsPerPage],
  (products, page, itemsPerPage) => {
    const start = (page - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredProducts, selectItemsPerPage],
  (products, itemsPerPage) => {
    return Math.ceil(products.length / itemsPerPage);
  }
);

export const selectProductCategories = createSelector([selectProducts], (products) => {
  const categories = new Set(products.map((p) => p.category));
  return ['All', ...Array.from(categories)];
});