'use client';

import { Box } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardContent from './DashboardContent';

export default function Home() {
  return (
    <DashboardLayout>
      <Box>
        <DashboardContent />
      </Box>
    </DashboardLayout>
  );
}
