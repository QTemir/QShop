// frontend/src/User/pages/LoginPage.jsx
import React, { useState } from "react";
import "./LoginPage.css";
import illustration from "../assets/login-illustration.svg";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isValid = email.trim() && password.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // сначала пробуем как админ (User)
            const resAuth = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (resAuth.ok) {
                const dataAuth = await resAuth.json();
                if (dataAuth.token) {
                    localStorage.setItem("token", dataAuth.token);
                    localStorage.setItem("userEmail", email);
                    onLogin?.(email);

                    if (dataAuth.role === "admin") {
                        navigate("/admin");
                        setLoading(false);
                        return;
                    }
                }
            }

            // если не админ — пробуем логин клиента
            const resClient = await fetch("http://localhost:5000/api/clients/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dataClient = await resClient.json();

            if (!dataClient.success) {
                setError(dataClient.message || "Ошибка входа");
                setLoading(false);
                return;
            }

            // клиент успешно вошёл
            const site = dataClient.site;
            localStorage.setItem("userEmail", email);
            localStorage.setItem("clientSiteName", site);
            onLogin?.(email);

            navigate(`/client/${site}/admin`);

        } catch (err) {
            console.error(err);
            setError("Ошибка подключения к серверу");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-content">
                    <h1 className="login-title">Вход</h1>

                    <form onSubmit={handleSubmit} className="login-form">
                        <label className="login-label">Почта</label>
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label className="login-label">Пароль</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && <div className="login-error">{error}</div>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={!isValid || loading}
                        >
                            {loading ? "Вход..." : "Войти"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={illustration} alt="Illustration" className="login-image" />
            </div>
        </div>
    );
}
