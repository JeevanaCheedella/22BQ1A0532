import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// import LoggingMiddleware from '../middleware/LoggingMiddleware'; // Placeholder for logging middleware

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2} color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            URL Shortener
          </Typography>
          <Button
            color={location.pathname === '/' ? 'secondary' : 'inherit'}
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: location.pathname === '/' ? 700 : 400,
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Shorten URLs
          </Button>
          <Button
            color={location.pathname === '/statistics' ? 'secondary' : 'inherit'}
            component={RouterLink}
            to="/statistics"
            sx={{
              fontWeight: location.pathname === '/statistics' ? 700 : 400,
              backgroundColor: location.pathname === '/statistics' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;