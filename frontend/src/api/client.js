import axios from 'axios'

// Create axios instance with backend base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (placeholder for future auth)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add auth token when auth is implemented
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    console.log('Making API request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (placeholder)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // TODO: Handle common errors (401, 403, etc.)
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default apiClient