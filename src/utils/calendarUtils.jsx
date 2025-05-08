// Utility functions for calendar integration

import dayjs from 'dayjs';
import { formatCustomerName } from './formatters';

/**
 * Assign colors to different activities
 * @param {string} activity - The activity name
 * @returns {string} A hex color code
 */
export const getActivityColor = (activity) => {
  if (!activity) return '#3788d8';

  // Convert activity to lowercase for case-insensitive matching
  const activityLower = activity.toLowerCase();

  // Color mapping for different activities
  const colorMap = {
    'gym': '#4CAF50',
    'jogging': '#2196F3',
    'spinning': '#F44336',
    'zumba': '#FF9800',
    'fitness': '#9C27B0',
    'yoga': '#00BCD4',
    'swimming': '#3F51B5',
    'boxing': '#795548',
    'cycling': '#607D8B',
    'pilates': '#E91E63',
  };

  // Check if activity contains any of the keys
  for (const [key, color] of Object.entries(colorMap)) {
    if (activityLower.includes(key)) {
      return color;
    }
  }

  return '#3788d8';
};

/**
 * Converts training data to FullCalendar events format
 * @param {Array} trainings - Array of training data
 * @returns {Array} Array of events in FullCalendar format
 */
export const convertTrainingsToEvents = (trainings) => {
  if (!trainings || !trainings.length) {
    return [];
  }

  return trainings.map(training => {

    const start = new Date(training.date);

    // Calculate end date by adding duration in minutes
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + training.duration);

    // Format title with activity and customer name
    const title = `${training.activity} / ${formatCustomerName(training.customer)}`;

    return {
      id: training.id.toString(),
      title: title,
      start: start,
      end: end,
      backgroundColor: getActivityColor(training.activity),
      borderColor: getActivityColor(training.activity),
      extendedProps: {
        activity: training.activity,
        customer: training.customer,
        duration: training.duration
      }
    };
  });
};

/**
 * Format event time for display
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} Formatted time range
 */
export const formatEventTime = (start, end) => {
  if (!start || !end) return '';

  const startTime = dayjs(start).format('HH:mm');
  const endTime = dayjs(end).format('HH:mm');

  return `${startTime} – ${endTime}`;
};

export default {
  convertTrainingsToEvents,
  getActivityColor,
  formatEventTime
}; 