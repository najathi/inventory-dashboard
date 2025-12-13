'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2563eb',
      },
      secondary: {
        main: '#10b981',
      },
    },
  });

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        {children}
      </MuiThemeProvider>
    </Provider>
  );
}
