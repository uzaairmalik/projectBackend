import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend
  headers: {
    'Content-Type': 'application/json' // Always send JSON
  }
});

export const applyForBed = async (formData) => {
  try {
    const response = await axios.post('/bed-applications', formData);
    return response.data;
  } catch (error) {
    // Ensure you're properly handling and throwing the error
    if (error.response) {
      throw error; // This preserves the full error response
    }
    throw new Error('Network error. Please check your connection.');
  }
};
    
   