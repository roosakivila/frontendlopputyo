// Handles API calls related to customers

// API base URL
const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

/**
 * Fetches all customers from the API
 * @returns {Promise} Promise that resolves to an array of customers
 */
const getCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data._embedded?.customers || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Adds a new customer
 * @param {Object} customer - Customer data
 * @returns {Promise} Promise that resolves to the created customer
 */
const addCustomer = async (customer) => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

/**
 * Updates an existing customer
 * @param {Object} customer - Updated customer data
 * @param {string} link - API link to the customer resource
 * @returns {Promise} Promise that resolves to the updated customer
 */
const updateCustomer = async (customer, link) => {
  try {
    const response = await fetch(link, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Deletes a customer
 * @param {string} link - API link to the customer resource
 * @returns {Promise} Promise that resolves when customer is deleted
 */
const deleteCustomer = async (link) => {
  try {
    const response = await fetch(link, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

const CustomerService = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};

export default CustomerService; 