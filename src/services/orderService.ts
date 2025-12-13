import { Order, OrderStatus } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }

  return res.json();
}

export async function getOrderById(id: number): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch order');
  }

  return res.json();
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Failed to update order status');
  }

  return res.json();
}