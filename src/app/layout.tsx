"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../components/Navbar";

const theme = createTheme({
  palette: {
    background: { default: "#f5f6fa" },
    primary: { main: "#0984e3" },
    secondary: { main: "#6c5ce7" }
  },
  typography: {
    fontFamily: "__Inter_9d0f31, system-ui, sans-serif"
  }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}