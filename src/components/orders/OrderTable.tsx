'use client';

import { useCallback, useMemo, useState } from 'react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Order, OrderFilters } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import { format } from 'date-fns';

interface OrderTableProps {
  orders: Order[];
  filters: OrderFilters;
  onFiltersChange: (filters: Partial<OrderFilters>) => void;
}

export default function OrderTable({
  orders,
  filters,
  onFiltersChange,
}: OrderTableProps) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'orderId',
        headerName: 'Order ID',
        width: 130,
        renderCell: (params) => (
          <Box sx={{ fontWeight: 600 }}>{params.value}</Box>
        ),
      },
      {
        field: 'customerName',
        headerName: 'Customer',
        width: 180,
      },
      {
        field: 'items',
        headerName: 'Products',
        width: 200,
        renderCell: (params) => {
          const items = params.value as Order['items'];
          return (
            <Box>
              {items.map((item, idx) => (
                <Box key={item.id} sx={{ fontSize: '0.875rem' }}>
                  {item.product.name} x{item.quantity}
                  {idx < items.length - 1 && ', '}
                </Box>
              ))}
            </Box>
          );
        },
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 120,
        renderCell: (params) => (
          <Box sx={{ fontWeight: 600 }}>${params.value.toFixed(2)}</Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => <OrderStatusBadge status={params.value} />,
      },
      {
        field: 'createdAt',
        headerName: 'Date',
        width: 150,
        renderCell: (params) =>
          format(new Date(params.value), 'MMM dd, yyyy'),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            variant="outlined"
            size="small"
            href={`/orders/${params.row.id}`}
            sx={{ mb: 4 }}
          >
            View
          </Button>
        ),
      },
    ],
    []
  );

  const handleSortChange = useCallback(
    (model: GridSortModel) => {
      if (model.length > 0) {
        const { field, sort } = model[0];
        onFiltersChange({
          sortField: field as OrderFilters['sortField'],
          sortDirection: sort as 'asc' | 'desc',
        });
      }
    },
    [onFiltersChange]
  );

  return (
    <Box>
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filters.status}
            label="Filter by Status"
            onChange={(e) => onFiltersChange({ status: e.target.value })}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        rows={orders}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        onSortModelChange={handleSortChange}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '& .MuiDataGrid-cell': {
            py: 2,
          },
        }}
      />
    </Box>
  );
}
