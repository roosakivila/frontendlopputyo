import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

/**
 * Confirmation dialog for risky operations like delete
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {function} props.onConfirm - Function to call when user confirms
 * @param {function} props.onCancel - Function to call when user cancels
 * @returns {JSX.Element} Confirmation dialog component
 */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        {title || 'Are you sure?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message || 'This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 