import api from './api';

/**
 * Sends a message to the FastAPI backend which calls Smallest.ai.
 * @param {string} message - The message sent by the user.
 * @returns {Promise<{reply: string}>} - The response from the backend.
 */
export const sendMessageToAI = async (message) => {
  try {
    const response = await api.post('/chat', { message }, {
      timeout: 20000 // 20 seconds timeout specifically for this AI call
    });
    return response.data;
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    // If the error response has a detail message from the backend, extract it
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    
    // If it's a timeout error from axios
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Connection to the backend server timed out. Please try again.');
    }
    
    // General network error
    throw new Error('Could not connect to the backend server. Make sure the FastAPI server is running.');
  }
};

/**
 * Sends a message to the FastAPI backend to classify it for routing.
 * @param {string} message - The message sent by the user.
 * @returns {Promise<{category: string, strategy: string, reason: string}>}
 */
export const analyzePrompt = async (message) => {
  try {
    const response = await api.post('/analyze', { message });
    return response.data;
  } catch (error) {
    console.error('Error in analyzePrompt:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to analyze prompt with the backend server.');
  }
};
