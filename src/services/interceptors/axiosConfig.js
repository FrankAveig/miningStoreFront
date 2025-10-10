import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL

const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use(

  (config) => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== 'undefined') {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token');
    
            break;
          case 403:
            // Manejar error de permisos
            break;
          case 404:
            // Manejar recurso no encontrado
            break;
          case 500:
            // Manejar error del servidor
            break;
        }
      }
      return Promise.reject(error); 
  }
);

export default api;