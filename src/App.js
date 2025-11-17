import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./User/pages/LoginPage";
import ProductsPage from "./User/pages/ProductsPage";
import ProductDetail from "./User/pages/ProductDetail";
import CartPage from "./User/pages/CartPage";
import AdminPanel from "./Moderator/AdminPanel";
import ClientApp from "./Client/ClientApp";

// Функция для определения роли пользователя
function getUserRole(email) {
    if (!email) return null;
    if (email.startsWith("admin@")) return "admin";
    if (email.startsWith("client@")) return "client";
    return "user";
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
                {/* LOGIN */}
                <Route path="/login" element={<LoginPage onLogin={setUserEmail} />} />

                {/* USER ROUTES (обычные пользователи) */}
                <Route
                    path="/products"
                    element={role === "user" ? <ProductsPage /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/product/:id"
                    element={role === "user" ? <ProductDetail /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/cart"
                    element={role === "user" ? <CartPage /> : <Navigate to="/login" replace />}
                />

                {/* ADMIN ROUTE */}
                <Route
                    path="/admin"
                    element={role === "admin" ? <AdminPanel /> : <Navigate to="/login" replace />}
                />

                {/* CLIENT ROUTES */}
                <Route
                    path="/client/*"
                    element={role === "client" ? <ClientApp /> : <Navigate to="/login" replace />}
                />

                {/* Redirect все остальные пути на login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}
