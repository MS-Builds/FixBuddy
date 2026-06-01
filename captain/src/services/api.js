import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://fix-buddy.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("captainToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and possibly redirect to login (handled by AuthContext or router)
      localStorage.removeItem("captainToken")
      window.dispatchEvent(new Event("auth-error"))
    }
    return Promise.reject(error)
  }
)

export default api
