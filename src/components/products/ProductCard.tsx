'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || 'https://via.placeholder.com/400'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            {product.name}
          </Typography>
          <Chip
            label={product.active ? 'Active' : 'Inactive'}
            color={product.active ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {product.category}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <Rating value={product.rating} readOnly precision={0.1} size="small" />
          <Typography variant="body2" color="text.secondary" ml={1}>
            {product.rating.toFixed(1)}
          </Typography>
        </Box>

        <Typography variant="h5" color="primary" mb={1}>
          ${product.price.toFixed(2)}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Stock: {product.stock}
        </Typography>

        <Button
          component={Link}
          href={`/products/${product.id}`}
          variant="contained"
          fullWidth
          sx={{ mt: 'auto' }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
