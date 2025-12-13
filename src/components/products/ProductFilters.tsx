'use client';

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ProductFilters as Filters } from '@/types/product';

interface ProductFiltersProps {
  filters: Filters;
  categories: string[];
  onFiltersChange: (filters: Partial<Filters>) => void;
}

export default function ProductFilters({
  filters,
  categories,
  onFiltersChange,
}: ProductFiltersProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        label="Search Products"
        value={filters.search}
        onChange={(e) => onFiltersChange({ search: e.target.value })}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          label="Category"
          onChange={(e) => onFiltersChange({ category: e.target.value })}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography gutterBottom>
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={(_, value) => {
            const [min, max] = value as number[];
            onFiltersChange({ minPrice: min, maxPrice: max });
          }}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
        />
      </Box>
    </Box>
  );
}