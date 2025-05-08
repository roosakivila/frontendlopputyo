import React, { useState } from 'react';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

/**
 * Dialog for adding a new training
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Object} props.customer - Customer for whom to add training
 * @param {function} props.onSave - Function to call when saving training
 * @param {function} props.onCancel - Function to call when canceling
 * @returns {JSX.Element} Training dialog component
 */
const TrainingDialog = ({ open, customer, onSave, onCancel }) => {
  const [date, setDate] = useState(dayjs());
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (errors.date) {
      setErrors({ ...errors, date: null });
    }
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
    if (errors.activity) {
      setErrors({ ...errors, activity: null });
    }
  };

  const handleDurationChange = (e) => {
    if (/^[0-9]*$/.test(e.target.value)) {
      setDuration(e.target.value);
      if (errors.duration) {
        setErrors({ ...errors, duration: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!date) newErrors.date = 'Date is required';
    if (!activity.trim()) newErrors.activity = 'Activity is required';

    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (parseInt(duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // Format data according to API requirements
        const trainingData = {
          date: date.toISOString(),
          activity: activity,
          duration: parseInt(duration),
          customer: customer._links.self.href
        };

        await onSave(trainingData);
        // Reset form
        setDate(dayjs());
        setActivity('');
        setDuration('');
        onCancel();
      } catch (error) {
        console.error('Error saving training:', error);
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
        Add New Training for {customer?.firstname} {customer?.lastname}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date and Time"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={Boolean(errors.date)}
                    helperText={errors.date}
                  />
                )}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: Boolean(errors.date),
                    helperText: errors.date
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Activity"
              value={activity}
              onChange={handleActivityChange}
              fullWidth
              required
              error={Boolean(errors.activity)}
              helperText={errors.activity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Duration (minutes)"
              value={duration}
              onChange={handleDurationChange}
              fullWidth
              required
              type="number"
              inputProps={{ min: 1 }}
              error={Boolean(errors.duration)}
              helperText={errors.duration}
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

export default TrainingDialog; 