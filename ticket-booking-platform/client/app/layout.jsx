"use client";

import { AuthProvider } from "../src/context/AuthContext.jsx";
import { ThemeProvider } from "../src/context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import "../src/index.css";

const googleClientId = "1020499525617-gtq7vp8g57nfv66djeu5lu3bul0i2np2.apps.googleusercontent.com";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TicketBari — Online Ticket Booking Platform</title>
        <meta name="description" content="Book bus, train, launch, and flight tickets easily." />
      </head>
      <body>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
              {children}
              <Toaster position="top-right" />
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
