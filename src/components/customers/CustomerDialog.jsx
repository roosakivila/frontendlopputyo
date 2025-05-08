import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';

/**
 * Dialog for adding or editing a customer
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Object} props.customer - Customer data for editing, null for adding
 * @param {function} props.onSave - Function to call when saving customer
 * @param {function} props.onCancel - Function to call when canceling
 * @returns {JSX.Element} Customer dialog component
 */
const CustomerDialog = ({ open, customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(customer);

  // Initialize form data when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        phone: customer.phone || '',
        streetaddress: customer.streetaddress || '',
        postcode: customer.postcode || '',
        city: customer.city || ''
      });
    } else {
      // Reset form when adding a new customer
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: ''
      });
    }
    // Reset errors when dialog opens/closes
    setErrors({});
  }, [customer, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation for required fields
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.streetaddress.trim()) newErrors.streetaddress = 'Street address is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onSave(formData);
        onCancel();
      } catch (error) {
        console.error('Error saving customer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditMode ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              name="firstname"
              label="First Name"
              value={formData.firstname}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.firstname)}
              helperText={errors.firstname}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="lastname"
              label="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.lastname)}
              helperText={errors.lastname}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="streetaddress"
              label="Street Address"
              value={formData.streetaddress}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.streetaddress)}
              helperText={errors.streetaddress}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="postcode"
              label="Postcode"
              value={formData.postcode}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.postcode)}
              helperText={errors.postcode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.city)}
              helperText={errors.city}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog; 