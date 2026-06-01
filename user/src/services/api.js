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
        const token = localStorage.getItem("userToken")
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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("userToken")
            window.dispatchEvent(new Event("auth-error"))
        }
        return Promise.reject(error)
    }
)

export default api
