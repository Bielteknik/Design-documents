import { apiService } from './apiService';
import { djangoApiService } from './djangoApiService';

// API Backend Selection
// true = Django Backend (Port 8000)
// false = Express Backend (Port 3001)
const USE_DJANGO_BACKEND = true;

// Export the selected API service
export const currentApiService = USE_DJANGO_BACKEND ? djangoApiService : apiService;

// Export both for debugging/testing
export { apiService as expressApiService, djangoApiService };
export default currentApiService;