import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect  } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { shadows } from './shadows';
import { palette } from './palette';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

function updateFavicon(isLightMode) {
  const faviconLight = '/favicon/dark-name/original.png';
  const faviconDark = '/favicon/light-name/original.png';

  const favicons = document.querySelectorAll("link[rel~='icon']");

  favicons.forEach(link => {
    link.href = isLightMode ? faviconLight : faviconDark;
  });
}
// ----------------------------------------------------------------------

export const ThemeContext = React.createContext({
  toggleTheme: () => {},
  mode: 'light',
  themeReady: false,
});

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const [themeReady, setThemeReady]= useState(false);

  const contextValue = useMemo(() => ({
    toggleTheme: () => {
      console.log(mode);
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
    mode,
    themeReady,
  }), [mode, themeReady]);

  const theme = useMemo(() => createTheme({
    palette: palette(mode),
    typography,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8},
    components: overrides(createTheme()),
  }), [mode])

  useEffect(() => {
    updateFavicon(mode === 'dark');
  }, [mode]);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setMode(mediaQuery.matches ? 'dark' : 'light');
  
    const listener = (e) => {
      setMode(e.matches ? 'dark' : 'light');
    };
  
    mediaQuery.addEventListener('change', listener);
    setThemeReady(true);
  
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // theme.components = overrides(theme);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};