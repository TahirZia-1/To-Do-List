import React, { useState } from 'react';
import {
  Paper,
  Checkbox,
  Typography,
  Box,
  TextField,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
  editingText,
  setEditingText,
  onSave,
  onCancelEdit
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Fade in={true}>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(5px)',
            boxShadow: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.task_id)}
            size="small"
          />
          
          <Box sx={{ ml: 1, flexGrow: 1 }}>
            {isEditing ? (
              <TextField
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                autoFocus
              />
            ) : (
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.disabled' : 'text.primary',
                }}
              >
                {task.description}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
          {isEditing ? (
            <>
              <IconButton onClick={() => onSave(task.task_id)} color="primary" size="small">
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={onCancelEdit} color="error" size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => onEdit(task)} color="primary" size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setDeleteDialogOpen(true)} color="error" size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>Are you sure you want to delete this task?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete(task.task_id);
              }} 
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
};

export default TaskItem; 