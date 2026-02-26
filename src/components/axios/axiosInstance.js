import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});


export default axiosInstance;
