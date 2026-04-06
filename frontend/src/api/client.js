import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const fetchUsers = () => axios.get(`${API_URL}/users`);

export const fetchDocuments = (userId) =>
  axios.get(`${API_URL}/documents`, { headers: { 'X-User-Id': userId } });

export const createDocument = (userId, data) =>
  axios.post(`${API_URL}/documents`, data, { headers: { 'X-User-Id': userId } });

export const updateDocument = (userId, docId, data) =>
  axios.put(`${API_URL}/documents/${docId}`, data, { headers: { 'X-User-Id': userId } });

export const shareDocument = (userId, docId, targetUserId) =>
  axios.post(`${API_URL}/documents/${docId}/share`,
    { shared_with_user_id: targetUserId, permission: "edit" },
    { headers: { 'X-User-Id': userId } }
  );

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};