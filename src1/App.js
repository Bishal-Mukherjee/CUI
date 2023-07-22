import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Router from './routes';
// theme
import ThemeProvider from './theme';
import { AppObjContext } from './context/context';
// components
// import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <AppObjContext>
            <ThemeProvider>
              <Router />
            </ThemeProvider>
          </AppObjContext>
        </BrowserRouter>
      </LocalizationProvider>
    </HelmetProvider>
  );
}
