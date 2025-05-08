// Utility functions for formatting data

import dayjs from 'dayjs';

/**
 * Formats a date string to dd.mm.yyyy hh:mm format
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('DD.MM.YYYY HH:mm');
};

/**
 * Formats customer name by combining first and last name
 * @param {Object} customer - Customer object with firstname and lastname
 * @returns {string} Formatted customer name
 */
export const formatCustomerName = (customer) => {
  if (!customer) return '';
  return `${customer.firstname} ${customer.lastname}`;
}; 