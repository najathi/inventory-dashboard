'use client';

import { useState } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import type { Breakpoint } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  maxWidth?: Breakpoint | false;
  disableContainer?: boolean;
}

export default function DashboardLayout({
  children,
  maxWidth = 'xl',
  disableContainer = false,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {disableContainer ? children : <Container maxWidth={maxWidth}>{children}</Container>}
      </Box>
    </Box>
  );
}
