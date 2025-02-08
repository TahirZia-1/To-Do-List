import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import '../styles/PasswordStrength.css';

const PasswordStrengthIndicator = ({ password }) => {
  // Don't render anything if password is empty
  if (!password) return null;

  // Password criteria checks
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  // Calculate strength percentage
  const calculateStrength = () => {
    const validCriteria = Object.values(criteria).filter(Boolean).length;
    return (validCriteria / 5) * 100;
  };

  // Get strength level and color
  const getStrengthLevel = () => {
    const strength = calculateStrength();
    if (strength === 0) return { level: 'Very Weak', color: '#ff4444' };
    if (strength <= 40) return { level: 'Weak', color: '#ffa700' };
    if (strength <= 80) return { level: 'Medium', color: '#ffcd3c' };
    return { level: 'Strong', color: '#14a44d' };
  };

  const strengthInfo = getStrengthLevel();

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Password Strength:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: strengthInfo.color, fontWeight: 500 }}
        >
          {strengthInfo.level}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={calculateStrength()}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: strengthInfo.color,
            transition: 'all 0.4s ease-out',
          },
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Password must contain:
        </Typography>
        <Box className="criteria-list">
          {[
            { key: 'length', label: 'At least 8 characters' },
            { key: 'uppercase', label: 'One uppercase letter' },
            { key: 'lowercase', label: 'One lowercase letter' },
            { key: 'number', label: 'One number' },
            { key: 'special', label: 'One special character (!@#$%^&*)' },
          ].map(({ key, label }) => (
            <Box key={key} className="criteria-item">
              {criteria[key] ? (
                <CheckCircleOutlineIcon className="check-icon" />
              ) : (
                <CancelOutlinedIcon className="cancel-icon" />
              )}
              <Typography variant="body2">{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator;
