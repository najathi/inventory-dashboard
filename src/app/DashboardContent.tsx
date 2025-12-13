'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProducts } from '@/features/products/productSlice';
import { fetchOrders } from '@/features/orders/orderSlice';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { selectOrderStats } from '@/features/orders/orderSelectors';

export default function DashboardContent() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const productsLoading = useAppSelector((state) => state.products.loading);
  const ordersLoading = useAppSelector((state) => state.orders.loading);
  const orderStats = useAppSelector(selectOrderStats);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  if (productsLoading || ordersLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Inventory fontSize="large" />,
      color: '#2563eb',
    },
    {
      title: 'Total Orders',
      value: orderStats.total,
      icon: <ShoppingCart fontSize="large" />,
      color: '#10b981',
    },
    {
      title: 'Active Products',
      value: products.filter((p) => p.active).length,
      icon: <TrendingUp fontSize="large" />,
      color: '#f59e0b',
    },
    {
      title: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toFixed(2)}`,
      icon: <AttachMoney fontSize="large" />,
      color: '#8b5cf6',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <Box mt={2}>
              {[
                { label: 'Pending', value: orderStats.pending, color: '#f59e0b' },
                { label: 'Shipped', value: orderStats.shipped, color: '#3b82f6' },
                { label: 'Delivered', value: orderStats.delivered, color: '#10b981' },
                { label: 'Cancelled', value: orderStats.cancelled, color: '#ef4444' },
              ].map((item) => (
                <Box key={item.label} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(item.value / orderStats.total) * 100}%`,
                        height: '100%',
                        bgcolor: item.color,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Categories
            </Typography>
            <Box mt={2}>
              {Object.entries(
                products.reduce((acc, p) => {
                  acc[p.category] = (acc[p.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => (
                <Box
                  key={category}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="body2">{category}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
