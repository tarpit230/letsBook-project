import React, { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Loader.css"

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = "success") => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
        })
    }

    const Loader = ({ size = "50px" }) => {
        return (
          <div className="loader-container">
            <div className="loader" style={{ width: size, height: size, borderColor: '#EC5228 transparent transparent transparent' }}></div>
          </div>
        );
      };

    return (
        <ToastContext.Provider value = {{ showToast, Loader,
            loading, setLoading,
         }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    )
}