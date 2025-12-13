export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  orderId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string | null;
  };
}

export interface OrderFilters {
  status: string;
  sortField: 'orderId' | 'total' | 'createdAt';
  sortDirection: 'asc' | 'desc';
}