import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext(
    () => {},
);

export const useToast = () => {
    return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = "success") => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
        })
    }

    return (
        <ToastContext.Provider value = {{ showToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    )
}