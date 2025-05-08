// Handles API calls related to trainings

// API base URL
const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

/**
 * Fetches all trainings with customer info from the API
 * @returns {Promise} Promise that resolves to an array of trainings
 */
const getTrainings = async () => {
  try {
    const response = await fetch(`${API_URL}/gettrainings`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
};

/**
 * Adds a new training
 * @param {Object} training - Training data
 * @returns {Promise} Promise that resolves to the created training
 */
const addTraining = async (training) => {
  try {
    const response = await fetch(`${API_URL}/trainings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(training),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding training:', error);
    throw error;
  }
};

/**
 * Deletes a training
 * @param {string} id - Training ID
 * @returns {Promise} Promise that resolves when training is deleted
 */
const deleteTraining = async (id) => {
  try {
    const response = await fetch(`${API_URL}/trainings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
};

const TrainingService = {
  getTrainings,
  addTraining,
  deleteTraining
};

export default TrainingService; 