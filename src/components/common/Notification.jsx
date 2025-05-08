import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Notification component for displaying success/error messages
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the notification is open
 * @param {string} props.message - Message to display
 * @param {string} props.severity - Severity of the notification (success, error, info, warning)
 * @param {function} props.onClose - Function to call when notification is closed
 * @returns {JSX.Element} Notification component
 */
const Notification = ({ open, message, severity, onClose }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity || 'info'} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 