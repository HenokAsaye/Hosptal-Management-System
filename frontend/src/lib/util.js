import axios from "axios"

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', 
    Accept: 'application/json',
  },
});

export default apiClient;