// API Configuration
export const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
};

export const API_ENDPOINTS = {
  STORY: `${API_CONFIG.BACKEND_URL}/story`,
};

