import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CursosPage from "./pages/CursosPage";
import CursoDetailPage from "./pages/CursoDetailPage";
import ContactoPage from "./pages/ContactoPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
              },
            }}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/cursos"
              element={
                <Layout>
                  <CursosPage />
                </Layout>
              }
            />
            <Route
              path="/cursos/:slug"
              element={
                <Layout>
                  <CursoDetailPage />
                </Layout>
              }
            />
            <Route
              path="/contacto"
              element={
                <Layout>
                  <ContactoPage />
                </Layout>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
