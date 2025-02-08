import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LogoutOutlined as LogoutIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { useTheme } from './context/ThemeContext';
import { getTheme } from './styles/theme';
import SignUp from './components/SignUp';
import Login from './components/Login';
import TaskItem from './components/TaskItem';
import TaskSkeleton from './components/TaskSkeleton';
import Header from './components/Header';
import TaskInput from './components/TaskInput';

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const { darkMode } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: token },
        });
        setIsLoggedIn(true);
        setCurrentUser(response.data.username);
        await fetchTasks();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setTasks(response.data);
    } catch (error) {
      showSnackbar('Error fetching tasks', 'error');
    }
  };

  const addTask = async (dueDate) => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        { 
          description: newTask.trim(),
          due_date: dueDate 
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setTasks([...tasks, response.data]);
      setNewTask('');
      showSnackbar('Task added successfully');
    } catch (error) {
      showSnackbar('Error adding task', 'error');
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const task = tasks.find(t => t.task_id === id);
      const response = await axios.put(
        `${API_URL}/tasks/${id}`,
        { completed: !task.completed },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setTasks(tasks.map(task => task.task_id === id ? response.data : task));
      showSnackbar('Task updated successfully');
    } catch (error) {
      showSnackbar('Error updating task', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setTasks(tasks.filter(task => task.task_id !== id));
      showSnackbar('Task deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting task', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser('');
    setTasks([]);
    showSnackbar('Logged out successfully');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.task_id);
    setEditingText(task.description);
  };

  const handleSaveEdit = async (id, dueDate) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}`,
        { 
          description: editingText.trim(),
          due_date: dueDate 
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setTasks(tasks.map(task => task.task_id === id ? response.data : task));
      setEditingTaskId(null);
      setEditingText('');
      showSnackbar('Task updated successfully');
    } catch (error) {
      showSnackbar('Error updating task', 'error');
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    })
    .filter(task => 
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dateCreated') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'dueDate') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sortBy === 'alphabetical') return a.description.localeCompare(b.description);
      return 0;
    });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <MUIThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                  <Header 
                    username={currentUser} 
                    onLogout={handleLogout}
                  />
                  <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <TaskInput 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onAdd={(dueDate) => addTask(dueDate)}
                        tasks={tasks}
                      />
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                          placeholder="Search tasks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ flexGrow: 1 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Filter</InputLabel>
                          <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            label="Filter"
                          >
                            <MenuItem value="all">All Tasks</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="incomplete">Incomplete</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sort By"
                          >
                            <MenuItem value="dateCreated">Date Created</MenuItem>
                            <MenuItem value="dueDate">Due Date</MenuItem>
                            <MenuItem value="alphabetical">Alphabetical</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Fade in={true}>
                        <Box>
                          {isLoading ? (
                            [...Array(3)].map((_, index) => (
                              <TaskSkeleton key={index} />
                            ))
                          ) : filteredAndSortedTasks.length === 0 ? (
                            <Typography color="text.secondary" align="center">
                              No tasks found
                            </Typography>
                          ) : (
                            filteredAndSortedTasks.map((task) => (
                              <TaskItem
                                key={task.task_id}
                                task={task}
                                onToggle={toggleTaskCompletion}
                                onDelete={deleteTask}
                                onEdit={handleEditTask}
                                isEditing={editingTaskId === task.task_id}
                                editingText={editingText}
                                setEditingText={setEditingText}
                                onSave={(dueDate) => handleSaveEdit(task.task_id, dueDate)}
                                onCancelEdit={() => setEditingTaskId(null)}
                              />
                            ))
                          )}
                        </Box>
                      </Fade>
                    </Paper>
                  </Container>
                </Box>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} 
          />
        </Routes>
      </Router>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MUIThemeProvider>
  );
};

const AppWrapper = () => {
  return (
    <App />
  );
};

export default AppWrapper;