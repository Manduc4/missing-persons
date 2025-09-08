import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://abitus-api.geia.vip/',
  timeout: 36000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
