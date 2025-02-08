import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeToggle from './ThemeToggle';

const Header = ({ username, onLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#4285f4' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3
      }}>
        {/* Left section - Welcome message */}
        <Typography 
          variant="body1"
          sx={{ 
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}
        >
          Welcome, {username}!
        </Typography>

        {/* Center section - TO DO LIST */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            letterSpacing: '0.5px',
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          TO DO LIST
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          <Button 
            color="inherit" 
            onClick={onLogout}
            sx={{ minWidth: 'auto' }}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 