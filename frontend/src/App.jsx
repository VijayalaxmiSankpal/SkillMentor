<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

const App = () => (
  <AuthProvider>
    <AppRouter />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#16162a",
          color: "#f1f5f9",
          border: "1px solid #1e1e35",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
        },
        success: { iconTheme: { primary: "#10b981", secondary: "#16162a" } },
        error:   { iconTheme: { primary: "#ef4444", secondary: "#16162a" } },
      }}
    />
  </AuthProvider>
);
=======
import React from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/shared/errors/ErrorBoundary";

function App() {
  return (
    <React.Fragment>
      <ErrorBoundary>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#16162a",
                color: "#f1f5f9",
                border: "1px solid #1e1e35",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#16162a" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#16162a" } },
            }}
          />
        </AuthProvider>
      </ErrorBoundary>
    </React.Fragment>
  );
}
>>>>>>> feat/notes-ui

export default App;