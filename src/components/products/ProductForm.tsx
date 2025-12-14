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
  FormHelperText,
} from '@mui/material';
import { Product } from '@/types/product';
import { z } from 'zod';

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
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'];

  const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional().or(z.literal('')),
    category: z
      .string()
      .refine((val) => categories.includes(val as (typeof categories)[number]), 'Select a category'),
    price: z.number().min(0, 'Price must be at least 0'),
    stock: z
      .number()
      .int('Stock must be a whole number')
      .min(0, 'Stock cannot be negative'),
    active: z.boolean(),
  });

  const makeZodValidator =
    <T,>(schema: z.ZodType<T>) =>
    (value: unknown) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        return result.error.issues[0]?.message ?? 'Invalid value';
      }
      return undefined;
    };

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
          <form.Field
            name="name"
            validators={{
              onChange: makeZodValidator(productSchema.shape.name),
              onBlur: makeZodValidator(productSchema.shape.name),
            }}
          >
            {(field) => (
              <TextField
                fullWidth
                label="Product Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]}
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
          <form.Field
            name="category"
            validators={{
              onChange: makeZodValidator(productSchema.shape.category),
              onBlur: makeZodValidator(productSchema.shape.category),
            }}
          >
            {(field) => (
              <FormControl fullWidth error={field.state.meta.errors.length > 0}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={field.state.value}
                  label="Category"
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {field.state.meta.errors[0] && (
                  <FormHelperText>{field.state.meta.errors[0]}</FormHelperText>
                )}
              </FormControl>
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field
            name="price"
            validators={{
              onChange: makeZodValidator(productSchema.shape.price),
              onBlur: makeZodValidator(productSchema.shape.price),
            }}
          >
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
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]}
              />
            )}
          </form.Field>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <form.Field
            name="stock"
            validators={{
              onChange: makeZodValidator(productSchema.shape.stock),
              onBlur: makeZodValidator(productSchema.shape.stock),
            }}
          >
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
                error={field.state.meta.errors.length > 0}
                helperText={field.state.meta.errors[0]}
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
