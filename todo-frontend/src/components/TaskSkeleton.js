import React from 'react';
import { Paper, Box, Skeleton } from '@mui/material';

const TaskSkeleton = () => {
  return (
    <Paper
      sx={{
        p: 1.5,
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '800px',
        mx: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1.5 }} />
        <Skeleton variant="text" width="70%" height={20} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Paper>
  );
};

export default TaskSkeleton; 