
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#144E99' },
    background: { default: '#F5F6F8', paper: '#FFFFFF' },
    statusColors: {
      draft: '#F6D56E',
      submitted: '#CDE8D6',
      reviewed: '#FAD2E1',
      approved: '#C9DBFF',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 600 },
  },
});

export default theme;
