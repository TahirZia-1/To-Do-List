import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskInput = ({ value, onChange, onAdd, tasks }) => {
  const [error, setError] = useState('');

  const checkDuplicate = () => {
    const normalizedNewTask = value.trim().toLowerCase();
    return tasks.some(task => task.description.toLowerCase() === normalizedNewTask);
  };

  const handleAdd = () => {
    if (checkDuplicate()) {
      setError('This task already exists!');
      return;
    }
    setError('');
    onAdd();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      handleAdd();
    }
  };

  const handleChange = (e) => {
    setError('');
    onChange(e);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        mb: error ? 1 : 2,
        width: '100%',
      }}>
        <TextField
          placeholder="Add a new task"
          fullWidth
          size="medium"
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={!!error}
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!value.trim()}
          sx={{
            height: '40px',
            minWidth: 'fit-content',
            backgroundColor: '#e0e0e0',
            color: 'text.primary',
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#d5d5d5',
            }
          }}
        >
          <AddIcon fontSize="small" />
          Add Task
        </Button>
      </Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            }
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TaskInput; 