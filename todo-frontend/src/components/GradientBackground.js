import React from 'react';
import { Box, Typography } from '@mui/material';
import authBg from '../assets/images/auth-bg.jpg'; // Add your image here

const GradientBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        backgroundImage: `url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: { xs: 'none', md: 'block' }, // Hide on mobile
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0))', // Very subtle gradient
        },
        '&::after': { // Additional layer for depth
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(59, 130, 246, 0.1)', // Very subtle blue tint
          mixBlendMode: 'overlay',
        }
      }}
    >
      {/* Stylish Text Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '4rem',
            fontWeight: 800,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            textShadow: `
              -2px -2px 0 #000,  
               2px -2px 0 #000,
              -2px  2px 0 #000,
               2px  2px 0 #000,
               4px 4px 8px rgba(0,0,0,0.5)
            `, // Added strong black outline and shadow
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            animation: 'fadeIn 1.5s ease-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateY(-20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          TO DO LIST
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            opacity: 0.9,
            fontWeight: 300,
            letterSpacing: '0.1em',
            mt: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Added shadow to subtitle
            fontFamily: "'Inter', sans-serif",
            animation: 'fadeInDelayed 1.5s ease-out 0.5s both',
            '@keyframes fadeInDelayed': {
              from: {
                opacity: 0,
                transform: 'translateY(-10px)',
              },
              to: {
                opacity: 0.9,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          Organize • Plan • Achieve
        </Typography>
      </Box>
    </Box>
  );
};

export default GradientBackground; 