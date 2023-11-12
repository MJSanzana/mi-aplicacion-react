import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/usuarios', // Ajusta esta URL a tu configuración
  withCredentials: true // Si estás usando cookies para la autenticación
});

export const getAllUsers = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};
