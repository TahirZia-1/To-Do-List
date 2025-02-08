import { createTheme } from '@mui/material/styles';

export const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#3B82F6', // Bright blue like in the image
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: darkMode ? '#121212' : '#FFFFFF',
      paper: darkMode ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary: darkMode ? '#FFFFFF' : '#111827',
      secondary: darkMode ? '#A0AEC0' : '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.25px',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      letterSpacing: '-0.25px',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.1px',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      letterSpacing: '0.15px',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.15px',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.3px',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.4px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontFamily: '"Inter", sans-serif',
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#3B82F6',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
}); 