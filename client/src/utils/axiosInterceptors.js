import axios from "axios";
import { BASE_URL } from "../config";

// Set global config
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

let isNavigating = false;

// This function sets up the interceptor
export const setupInterceptors = (logout, navigate) => {
    
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        !isNavigating
      ) {
        isNavigating = true;
        logout();
        navigate("/login", { replace: true });
      }
      return Promise.reject(error);
    }
  );
};
