    // src/utils/axiosInstance.js
    import config from '@/config';
import axios from 'axios';

    const axiosInstance = axios.create({
      baseURL:config.baseUrl, // Your API base URL
      withCredentials:true,
    });

    // Add request/response interceptors here if needed
    axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token or other headers
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    export default axiosInstance;