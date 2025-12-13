'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchProductById,
  updateProduct,
  clearSelectedProduct,
} from '@/features/products/productSlice';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Rating,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductForm from '@/components/products/ProductForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);

  const product = useAppSelector((state) => state.products.selectedProduct);
  const loading = useAppSelector((state) => state.products.loading);

  const productId = useMemo(() => {
    if (!params?.id) return null;
    const idAsString = Array.isArray(params.id) ? params.id[0] : params.id;
    const parsed = parseInt(idAsString, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [params?.id]);

  useEffect(() => {
    if (productId === null) return;

    dispatch(fetchProductById(productId))
      .unwrap()
      .catch(() => {
        toast.error('Failed to load product');
        router.push('/products');
      });

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId, router]);

  const handleUpdate = async (data: Partial<Product>) => {
    if (productId === null) {
      toast.error('Invalid product id');
      return;
    }

    try {
      await dispatch(
        updateProduct({ id: productId, data })
      ).unwrap();
      toast.success('Product updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update product', error);
      toast.error('Failed to update product');
    }
  };

  if (loading || !product) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/products')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Paper sx={{ p: 4 }}>
        {editMode ? (
          <>
            <Typography variant="h4" gutterBottom>
              Edit Product
            </Typography>
            <ProductForm
              product={product}
              onSubmit={handleUpdate}
              onCancel={() => setEditMode(false)}
            />
          </>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={product.image || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h3" gutterBottom>
                  {product.name}
                </Typography>
                <Chip
                  label={product.active ? 'Active' : 'Inactive'}
                  color={product.active ? 'success' : 'default'}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <Rating value={product.rating} readOnly precision={0.1} />
                <Typography variant="body1" ml={1} color="text.secondary">
                  {product.rating.toFixed(1)} / 5.0
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>

              <Box mb={3}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip label={product.category} />
              </Box>

              <Box mb={3}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Stock Quantity
                </Typography>
                <Typography variant="h6">{product.stock} units</Typography>
              </Box>

              <Box mb={4}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {product.description || 'No description available'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => setEditMode(true)}
              >
                Edit Product
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </DashboardLayout>
  );
}
