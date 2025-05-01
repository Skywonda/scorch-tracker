import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#48BB78",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#F56565",
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default ToastProvider;
