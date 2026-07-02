import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const googleClientId = process.env.NEXT_PUBLIC_VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
