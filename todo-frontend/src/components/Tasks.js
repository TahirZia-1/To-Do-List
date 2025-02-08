import React from 'react';
import { Box, Container, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TasksBackground from './TasksBackground';
import TaskList from './TaskList'; // Assuming you have this component

const Tasks = () => {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <TasksBackground />
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: 4,
        }}
      >
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3
        }}>
          <TextField
            placeholder="Add a new task"
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              }
            }}
          />
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#e0e0e0',
              color: 'text.primary',
              height: '40px',
              width: 'auto',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              '&:hover': {
                backgroundColor: '#d5d5d5'
              }
            }}
          >
            <AddIcon fontSize="small" />
            Add Task
          </Button>
        </Box>
        
        <TaskList /> {/* Your existing tasks content */}
      </Container>
    </Box>
  );
};

export default Tasks; 