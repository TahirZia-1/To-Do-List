import React from 'react';
import { Box } from '@mui/material';
import tasksBg from '../assets/images/tasks-bg.jpg'; // Add your image here

const TasksBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${tasksBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // Light overlay
          backdropFilter: 'blur(20px)', // Strong blur for better readability
        },
        '&::after': { // Additional layer for depth
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'brightness(1.1) contrast(1.1)', // Subtle enhancement
        },
        zIndex: -1,
      }}
    />
  );
};

export default TasksBackground; 