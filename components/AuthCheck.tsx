import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export default function LoginModal({ open, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!PHONE_REGEX.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError(null);
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      onLoginSuccess(data);
      onClose();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError(null);
  
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }
  
      const data = await response.json();
      setIsSignUp(false);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', phone: '', });
    setErrors({});
    setApiError(null);
    onClose();
  };

  const toggleSignUp = () => {
    setIsSignUp(prev => !prev);
    setFormData({ fullName: '', email: '', phone: '', });
    setErrors({});
    setApiError(null);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.87)' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      '&.Mui-focused': {
        color: 'black',
      },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          px: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />
          )}

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          {isSignUp && (
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />
          )}

          

          {isSignUp && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1 }}>
            <Button
              variant="text"
              onClick={toggleSignUp}
              sx={{ 
                color: 'black',
                textTransform: 'none'
              }}
            >
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: 'black',
                '&:hover': { bgcolor: '#333' },
                minWidth: 120
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                isSignUp ? 'Sign Up' : 'Login'
              )}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}