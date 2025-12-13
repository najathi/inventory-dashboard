'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchProducts,
  setFilters,
  setPage,
} from '@/features/products/productSlice';
import {
  selectPaginatedProducts,
  selectProductFilters,
  selectTotalPages,
  selectProductPage,
  selectProductLoading,
  selectProductCategories,
} from '@/features/products/productSelectors';
import {
  Box,
  Grid,
  Pagination,
  Typography,
  Toolbar,
  Container,
} from '@mui/material';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const products = useAppSelector(selectPaginatedProducts);
  const filters = useAppSelector(selectProductFilters);
  const currentPage = useAppSelector(selectProductPage);
  const totalPages = useAppSelector(selectTotalPages);
  const loading = useAppSelector(selectProductLoading);
  const categories = useAppSelector(selectProductCategories);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .catch(() => toast.error('Failed to load products'));
  }, [dispatch]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        onMenuClick={() => setMobileOpen(!mobileOpen)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>

          <ProductFilters
            filters={filters}
            categories={categories}
            onFiltersChange={handleFiltersChange}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
              <>
              <Grid container spacing={3} mb={4}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {products.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No products found
                  </Typography>
                </Box>
              )}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}
