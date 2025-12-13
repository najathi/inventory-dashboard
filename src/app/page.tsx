'use client';

import { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardContent from './DashboardContent';

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        onMenuClick={() => setMobileOpen(!mobileOpen)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Container maxWidth="xl">
          <DashboardContent />
        </Container>
      </Box>
    </Box>
  );
}