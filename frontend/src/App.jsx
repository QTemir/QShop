// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./User/pages/LoginPage";
import ProductsPage from "./User/pages/ProductsPage";
import ProductDetail from "./User/pages/ProductDetail";
import CartPage from "./User/pages/CartPage";
import AdminPanel from "./Moderator/AdminPanel";
import ClientApp from "./Client/ClientApp";

function getUserRole(email) {
    if (!email) return null;
    if (email.startsWith("admin@")) return "admin";
    if (localStorage.getItem("clientSiteName")) return "client";
    return "user";
}

function ProtectedRoute({ allowedRoles, role, children }) {
    if (!role) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;
    return children;
}

function ProtectedClientRoute({ role, children }) {
    const urlSite = window.location.pathname.split("/")[2];
    const savedSite = localStorage.getItem("clientSiteName");
    if (role !== "client") return <Navigate to="/login" replace />;
    if (urlSite !== savedSite) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("userEmail");
        if (saved) setUserEmail(saved);
    }, []);

    const role = getUserRole(userEmail);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={setUserEmail} />} />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allowedRoles={["user"]} role={role}>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product/:id"
                    element={
                        <ProtectedRoute allowedRoles={["user"]} role={role}>
                            <ProductDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute allowedRoles={["user"]} role={role}>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]} role={role}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:clientSiteName/*"
                    element={
                        <ProtectedClientRoute role={role}>
                            <ClientApp />
                        </ProtectedClientRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}
