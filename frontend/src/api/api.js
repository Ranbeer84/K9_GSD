/**
 * API Integration for K9 GSD Kennel
 * Axios-based HTTP client for backend communication
 */

import axios from "axios";

// Base API URL - change this for production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add auth token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  verify: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("admin_token");
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// ============================================
// PUPPIES API
// ============================================

export const puppiesAPI = {
  // Public endpoints
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.featured) params.append("featured", "true");

    const response = await api.get(`/puppies?${params}`);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/puppies/${id}`);
    return response.data;
  },

  // Admin endpoints
  create: async (formData) => {
    const response = await api.post("/puppies/admin", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/puppies/admin/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/puppies/admin/${id}`);
    return response.data;
  },

  addImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await api.post(`/puppies/admin/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/puppies/admin/images/${imageId}`);
    return response.data;
  },
};

// ============================================
// DOGS API (Parent Dogs)
// ============================================

export const dogsAPI = {
  // Public endpoints
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.gender) params.append("gender", filters.gender);

    const response = await api.get(`/dogs?${params}`);
    return response.data; // Backend returns { dogs: [...], count: N }
  },

  getOne: async (id) => {
    const response = await api.get(`/dogs/${id}`);
    return response.data; // Returns single dog object
  },

  // Admin endpoints
  getAllAdmin: async () => {
    const response = await api.get("/dogs/admin");
    return response.data; // Returns { dogs: [...], count: N }
  },

  create: async (formData) => {
    const response = await api.post("/dogs/admin", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/dogs/admin/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/dogs/admin/${id}`);
    return response.data;
  },

  addImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await api.post(`/dogs/admin/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/dogs/admin/images/${imageId}`);
    return response.data;
  },
};

// ============================================
// GALLERY API
// ============================================

export const galleryAPI = {
  // Public endpoints
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.media_type) params.append("media_type", filters.media_type);

    const response = await api.get(`/gallery?${params}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/gallery/categories");
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async () => {
    const response = await api.get("/gallery/admin");
    return response.data;
  },

  upload: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata.title) formData.append("title", metadata.title);
    if (metadata.description)
      formData.append("description", metadata.description);
    if (metadata.category) formData.append("category", metadata.category);

    const response = await api.post("/gallery/admin", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // UPDATED: Now supports passing either a raw files array or prepared formData
  bulkUpload: async (payload, category = "General") => {
    let body = payload;

    // If payload isn't already FormData, create it
    if (!(payload instanceof FormData)) {
      body = new FormData();
      payload.forEach((file) => body.append("files", file));
      body.append("category", category);
    }

    const response = await api.post("/gallery/admin/bulk-upload", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/gallery/admin/${id}`);
    return response.data;
  },
};

// ============================================
// BOOKINGS API
// ============================================

export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);

    const response = await api.get(`/bookings/admin?${params}`);
    return response.data;
  },

  update: async (id, updateData) => {
    const response = await api.put(`/bookings/admin/${id}`, updateData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/bookings/admin/${id}`);
    return response.data;
  },
};

// ... existing API objects (authAPI, dogsAPI, galleryAPI, etc.)

// ============================================
// UTILITY FUNCTIONS - ADD THESE AT THE BOTTOM
// ============================================

export const getImageURL = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http")) return imagePath;

  // Otherwise, construct URL from backend
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002";

  // Ensure we don't double up on slashes
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseURL}/uploads/${cleanPath}`;
};

export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.error || "An error occurred";
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Something else went wrong
    return error.message || "An unexpected error occurred";
  }
};

// Ensure your default export is still here

export default api;
