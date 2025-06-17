import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

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
  const response = await api.get("/products");
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const createSale = async (sale) => {
  console.log(sale);
  const response = await api.post("/sales", sale);
  return response.data;
};

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

export const getReport = async (startDate, endDate) => {
  const response = await api.get(
    `/sales/report?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const signUp = async (username, password) => {
  const response = await api.post("/signUp", { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const approveUser = async (id, approved) => {
  const response = await api.put(`/users/${id}`, { approved });
  console.log(response);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const logout = async () => {
  const reponse = await api.get("/logout");
  return reponse;
};
