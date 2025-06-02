import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
