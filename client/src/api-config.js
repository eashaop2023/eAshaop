// Get API base URL from environment variable with fallback
const getApiBaseUrl = () => {
  // Check for VITE_SERVER_URL (Vite environment variable)
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  
  // Fallback for development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Fallback: try to construct from current origin (for production)
  // This assumes frontend and backend are on same domain
  const origin = window.location.origin;
  return origin;
};

export const API_BASE_URL = getApiBaseUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('[API Config] API_BASE_URL:', API_BASE_URL);
  console.log('[API Config] VITE_SERVER_URL env:', import.meta.env.VITE_SERVER_URL);
}
