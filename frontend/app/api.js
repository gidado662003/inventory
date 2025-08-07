import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Axios interceptor for 401 errors, except for /login endpoint
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !(error.config && error.config.url && error.config.url.includes("/login"))
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const createProduct = async (product) => {
  try {
    const response = await api.post("/products", product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error.response?.data || error;
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error getting products:", error);
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error.response?.data || error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error.response?.data || error;
  }
};

export const createSale = async (sale) => {
  try {
    const response = await api.post("/sales", sale);
    return response.data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error.response?.data || error;
  }
};

export const getSales = async () => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    console.error("Error getting sales:", error);
    throw error.response?.data || error;
  }
};

export const getReport = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/sales/report?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting report:", error);
    throw error.response?.data || error;
  }
};

export const signUp = async (username, password) => {
  try {
    const response = await api.post("/signUp", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error.response?.data || error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error.response?.data || error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error.response?.data || error;
  }
};

export const approveUser = async (id, approved) => {
  try {
    const response = await api.put(`/users/${id}`, { approved });
    return response.data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error.response?.data || error;
  }
};

export const logUserout = async () => {
  try {
    const response = await api.post("/logout");
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error.response?.data || error;
  }
};

export const getCustomers = async () => {
  try {
    const response = await api.get("/customers");
    return response.data;
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error.response?.data || error;
  }
};

export const createCustomer = async (customer) => {
  try {
    const response = await api.post("/customers", customer);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error.response?.data || error;
  }
};
