const API_BASE = "http://localhost:8080";

export const auth = {
  getToken: () => localStorage.getItem("admin_token"),
  setToken: (token) => localStorage.setItem("admin_token", token),
  getUser: () => {
    const userStr = localStorage.getItem("admin_user");
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => localStorage.setItem("admin_user", JSON.stringify(user)),
  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },
  isAuthenticated: () => Boolean(localStorage.getItem("admin_token")),
};

async function request(endpoint, options = {}) {
  const token = auth.getToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    auth.logout();
    window.location.reload();
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      auth.setToken(data.token);
      auth.setUser(data.user);
    }
    return data;
  },

  // Stats
  getStats: () => request("/api/admin/stats"),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/products${qs ? `?${qs}` : ""}`);
  },

  createProduct: (formData) =>
    request("/api/admin/products", {
      method: "POST",
      body: formData,
    }),

  updateProduct: (id, formData) =>
    request(`/api/admin/products/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteProduct: (id) =>
    request(`/api/admin/products/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () => request("/api/categories"),

  createCategory: (data) =>
    request("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id, data) =>
    request(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id) =>
    request(`/api/admin/categories/${id}`, {
      method: "DELETE",
    }),
};
