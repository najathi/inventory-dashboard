'use client';

import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import PackageIcon from '@mui/icons-material/Inventory2';

interface NavbarProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ onMenuClick, darkMode, onToggleDarkMode }: NavbarProps) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <PackageIcon sx={{ mr: 2 }} />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Dashboard
        </Typography>

        <IconButton color="inherit" onClick={onToggleDarkMode}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
