import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Grid,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export default function ContactForm({ open, handleClose, data }) {
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    useCase: '',
    companyName: '',
    turnover: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (data) {
      setFormValues((prev) => ({
        ...prev,
        fullName: data.fullname || '',
        email: data.email || '',
        phone: data.phone || '',
      }));
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formValues.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formValues.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formValues.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!PHONE_REGEX.test(formValues.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formValues.useCase.trim()) {
      newErrors.useCase = 'Use case description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormValues({
      fullName: '',
      email: '',
      phone: '',
      useCase: '',
      companyName: '',
      turnover: '',
      country: ''
    });
    setErrors({});
    setTimeout(() => {
      setSubmitStatus(null); 
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      if (data.success) {
        setSubmitStatus({ severity: "success", message: "Your message has been sent successfully!" });
        resetForm();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        severity: "error", 
        message: "There was an error sending your message. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
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
    <Modal 
      open={open} 
      onClose={handleModalClose}
      aria-labelledby="contact-form-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
          maxWidth: 1000,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={handleModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black',
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Typography id="contact-form-title" variant="h6" component="h2" gutterBottom>
          Contact Us
        </Typography>
        {submitStatus && (
          <Alert 
            severity={submitStatus.severity} 
            sx={{ mb: 2 }}
            onClose={() => setSubmitStatus(null)}
          >
            {submitStatus.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                required
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                required
                name="email"
                value={formValues.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                type="tel"
                required
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                name="companyName"
                value={formValues.companyName}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Turnover"
                variant="outlined"
                name="turnover"
                value={formValues.turnover}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                name="country"
                value={formValues.country}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tell Us About Your Use Case"
                variant="outlined"
                multiline
                rows={4}
                required
                name="useCase"
                value={formValues.useCase}
                onChange={handleChange}
                error={!!errors.useCase}
                helperText={errors.useCase}
                disabled={loading}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 1,
                  backgroundColor: 'black',
                  '&:hover': { backgroundColor: '#333' },
                  height: 48,
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}