// Utility functions for exporting data to CSV

import { saveAs } from 'file-saver';

/**
 * Convert an array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} excludeFields - Fields to exclude from CSV
 * @returns {string} CSV formatted string
 */
const convertToCSV = (data, excludeFields = []) => {
  if (!data || !data.length) {
    return '';
  }

  // Get all unique keys from all objects in the array
  const allKeys = data.reduce((keys, item) => {
    Object.keys(item).forEach(key => {
      if (!keys.includes(key) && !excludeFields.includes(key)) {
        keys.push(key);
      }
    });
    return keys;
  }, []);

  // Create the header row
  const header = allKeys.join(',');

  // Create the data rows
  const rows = data.map(item => {
    return allKeys.map(key => {
      // Handle undefined values
      const value = item[key] === undefined ? '' : item[key];
      // Format the value for CSV
      // Wrap with quotes if it's a string and escape any quotes inside
      if (typeof value === 'string') {
        // Escape quotes and wrap with quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  // Combine header and rows
  return [header, ...rows].join('\n');
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the output file
 * @param {Array} excludeFields - Fields to exclude from CSV
 */
export const exportToCSV = (data, filename, excludeFields = []) => {
  try {
    // Convert data to CSV format
    const csvString = convertToCSV(data, excludeFields);

    // Create blob and save file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

export default {
  exportToCSV
}; 