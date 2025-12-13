'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchOrders, setOrderFilters } from '@/features/orders/orderSlice';
import {
  selectFilteredAndSortedOrders,
  selectOrderFilters,
  selectOrderLoading,
  selectOrderStats,
} from '@/features/orders/orderSelectors';
import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrderTable from '@/components/orders/OrderTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  PendingActions,
  LocalShipping,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

export default function OrdersPage() {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectFilteredAndSortedOrders);
  const filters = useAppSelector(selectOrderFilters);
  const loading = useAppSelector(selectOrderLoading);
  const stats = useAppSelector(selectOrderStats);

  useEffect(() => {
    dispatch(fetchOrders())
      .unwrap()
      .catch(() => toast.error('Failed to load orders'));
  }, [dispatch]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setOrderFilters(newFilters));
  };

  const statusCards = [
    {
      title: 'Pending',
      value: stats.pending,
      icon: <PendingActions fontSize="large" />,
      color: '#f59e0b',
    },
    {
      title: 'Shipped',
      value: stats.shipped,
      icon: <LocalShipping fontSize="large" />,
      color: '#3b82f6',
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: <CheckCircle fontSize="large" />,
      color: '#10b981',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: <Cancel fontSize="large" />,
      color: '#ef4444',
    },
  ];

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      <Grid container spacing={3} mb={4}>
        {statusCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <OrderTable
          orders={orders}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </DashboardLayout>
  );
}
