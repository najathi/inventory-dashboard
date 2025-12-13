'use client';

import { Chip } from '@mui/material';
import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'warning' as const },
  SHIPPED: { label: 'Shipped', color: 'info' as const },
  DELIVERED: { label: 'Delivered', color: 'success' as const },
  CANCELLED: { label: 'Cancelled', color: 'error' as const },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
    />
  );
}