import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#F64747' },         
    secondary: { main: '#F64747' },       
    background: {
      default: '#1d1d1f',                 
      paper: '#3b3b3b',                    
    },
    text: {
      primary: '#e6e6e6',                  
      secondary: '#c4c4c4',                
    },
    divider: '#3b3b3b',
  },

  shape: { borderRadius: 14 },

  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: { fontWeight: 700, letterSpacing: 0.2 },
    subtitle2: { letterSpacing: 0.2 },
    button: { fontWeight: 800, fontSize: '0.95rem' }, 
  },

  
});

export default theme;
