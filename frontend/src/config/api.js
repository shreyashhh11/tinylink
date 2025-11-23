// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  LINKS: `${API_BASE_URL}/api/links`,
  LINK_BY_CODE: (code) => `${API_BASE_URL}/api/links/${code}`,
  HEALTH: `${API_BASE_URL}/healthz`
};

export default API_BASE_URL;