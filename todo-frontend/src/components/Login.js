import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
} from '@mui/icons-material';
import GradientBackground from './GradientBackground';

// Import social media icons
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation rules
  const validateUsernameOrEmail = (value) => {
    if (!value) return 'Username or Email is required';
    if (value.length < 3) return 'Please enter a valid username or email';
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if it's a username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    
    if (!emailRegex.test(value) && !usernameRegex.test(value)) {
      return 'Please enter a valid username or email format';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      usernameOrEmail: validateUsernameOrEmail(formData.usernameOrEmail),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        usernameOrEmail: formData.usernameOrEmail.trim(),
        password: formData.password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/';
      }
    } catch (error) {
      let errorMessage = 'Failed to login. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username/email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'Account not found';
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 4,
          pl: { xs: 4, sm: 6, md: 12, lg: 16 },
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Sign In
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              error={!!errors.usernameOrEmail}
              helperText={errors.usernameOrEmail}
              margin="normal"
              required
              size="small"
              autoComplete="username"
              InputProps={{
                autoComplete: 'username'
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              size="small"
              autoComplete="current-password"
              InputProps={{
                autoComplete: 'current-password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Typography 
            variant="body2" 
            align="center"
            sx={{ mt: 2 }}
          >
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                textDecoration: 'none', 
                color: '#4285f4'
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
      
      <GradientBackground />
    </Box>
  );
};

export default Login;