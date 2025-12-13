'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

type ColorMode = 'light' | 'dark';

const ThemeModeContext = createContext<{
  mode: ColorMode;
  toggleMode: () => void;
} | null>(null);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within Providers');
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563eb',
          },
          secondary: {
            main: '#10b981',
          },
        },
      }),
    [mode]
  );

  return (
    <Provider store={store}>
      <ThemeModeContext.Provider value={colorMode}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-right" />
          {children}
        </MuiThemeProvider>
      </ThemeModeContext.Provider>
    </Provider>
  );
}
