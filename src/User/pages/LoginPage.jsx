import React, { useState } from "react";
import "./LoginPage.css";
import illustration from "../assets/login-illustration.svg";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const isValid = email.trim() && password.trim();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Сохраняем email в localStorage
        localStorage.setItem("userEmail", email);

        // Вызываем функцию из App.js (чтобы React знал, кто вошёл)
        onLogin?.(email);

        const lowerEmail = email.toLowerCase();

        if (lowerEmail.startsWith("admin@")) {
            navigate("/admin");
        } else if (lowerEmail.startsWith("client@")) {
            navigate("/client/admin"); // главная страница клиента
        } else {
            navigate("/products");
        }
    };

    return (
        <div className="login-container">
            {/* Левая часть */}
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

                        <button
                            type="submit"
                            className="login-button"
                            disabled={!isValid}
                        >
                            Войти
                        </button>
                    </form>
                </div>
            </div>

            {/* Правая часть */}
            <div className="login-right">
                <img
                    src={illustration}
                    alt="Illustration"
                    className="login-image"
                />
            </div>
        </div>
    );
}
