'use client';

import { useForm } from '@tanstack/react-form';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
} from '@mui/material';
import { Product } from '@/types/product';

type ProductFormValues = {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
};

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const defaultValues: ProductFormValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Electronics',
    price: product?.price || 0,
    stock: product?.stock || 0,
    active: product?.active ?? true,
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Grid container spacing={3}>
        <Grid size={12}>
          <form.Field name="name">
            {(field) => (
              <TextField
                fullWidth
                label="Product Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={12}>
          <form.Field name="description">
            {(field) => (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field name="category">
            {(field) => (
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={field.state.value}
                  label="Category"
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field name="price">
            {(field) => (
              <TextField
                fullWidth
                type="number"
                label="Price"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field name="stock">
            {(field) => (
              <TextField
                fullWidth
                type="number"
                label="Stock Quantity"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                inputProps={{ min: 0 }}
                required
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field name="active">
            {(field) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                }
                label="Active"
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            {onCancel && (
              <Button onClick={onCancel} variant="outlined">
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              {product ? 'Update' : 'Create'} Product
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
