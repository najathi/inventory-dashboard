'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  clearSelectedOrder,
  fetchOrderById,
  updateOrderStatus,
} from '@/features/orders/orderSlice';
import {
  selectOrderLoading,
  selectSelectedOrder,
} from '@/features/orders/orderSelectors';
import { OrderStatus } from '@/types/order';
import toast from 'react-hot-toast';

const statusActions: { label: string; value: OrderStatus; color: 'primary' | 'secondary' | 'error' }[] = [
  { label: 'Mark as Pending', value: 'PENDING', color: 'secondary' },
  { label: 'Mark as Shipped', value: 'SHIPPED', color: 'primary' },
  { label: 'Mark as Delivered', value: 'DELIVERED', color: 'primary' },
  { label: 'Cancel Order', value: 'CANCELLED', color: 'error' },
];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const order = useAppSelector(selectSelectedOrder);
  const loading = useAppSelector(selectOrderLoading);

  const orderId = useMemo(() => {
    if (!params?.id) return null;
    const idAsString = Array.isArray(params.id) ? params.id[0] : params.id;
    const parsed = parseInt(idAsString, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [params?.id]);

  useEffect(() => {
    if (orderId === null) return;

    dispatch(fetchOrderById(orderId))
      .unwrap()
      .catch(() => {
        toast.error('Failed to load order');
        router.push('/orders');
      });

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, orderId, router]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (orderId === null) {
      toast.error('Invalid order id');
      return;
    }
    if (order?.status === status) {
      toast.success('Order already in this status');
      return;
    }

    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success('Order status updated');
      setPendingStatus(null);
    } catch (error) {
      console.error('Failed to update order status', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading || !order) {
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
        onClick={() => router.push('/orders')}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="h5">Order {order.orderId}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {format(new Date(order.createdAt), 'PPP')}
                </Typography>
              </Box>
              <OrderStatusBadge status={order.status} />
            </Box>

            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="h6">{order.customerName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h6">${order.total.toFixed(2)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {format(new Date(order.updatedAt), 'PPpp')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Items
                </Typography>
                <Typography variant="body1">{order.items.length} products</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <Stack spacing={2}>
              {order.items.map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1">{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} • ${item.price.toFixed(2)} each
                      </Typography>
                    </Box>
                    <Chip label={`$${(item.price * item.quantity).toFixed(2)}`} />
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Status
            </Typography>
            <Stack spacing={1.5}>
              {statusActions.map((action) => (
                <Button
                  key={action.value}
                  variant={order.status === action.value ? 'contained' : 'outlined'}
                  color={action.color}
                  onClick={() => setPendingStatus(action.value)}
                  disabled={loading}
                  fullWidth
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Stack spacing={1}>
              <SummaryRow label="Subtotal" value={`$${order.total.toFixed(2)}`} />
              <SummaryRow label="Shipping" value="$0.00" />
              <SummaryRow label="Tax" value="$0.00" />
              <Divider />
              <SummaryRow label="Total" value={`$${order.total.toFixed(2)}`} bold />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={Boolean(pendingStatus)}
        title="Confirm Status Update"
        message={
          pendingStatus
            ? `Are you sure you want to mark this order as ${getStatusLabel(pendingStatus)}?`
            : ''
        }
        confirmText="Update Status"
        onConfirm={() => pendingStatus && handleStatusChange(pendingStatus)}
        onCancel={() => setPendingStatus(null)}
      />
    </DashboardLayout>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={bold ? 700 : 500}>{value}</Typography>
    </Box>
  );
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'SHIPPED':
      return 'Shipped';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}
