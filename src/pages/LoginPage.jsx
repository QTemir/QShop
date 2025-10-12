import React, { useState } from "react";
import "./LoginPage.css";
import illustration from "../assets/login-illustration.svg"; // путь к svg
import { useNavigate } from "react-router-dom"; // ✅ добавили

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isValid = email.trim() && password.trim();

    const navigate = useNavigate(); // ✅ добавили

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", { email, password });

        // ✅ ИМЕННО ЭТА СТРОКА:
        navigate("/products"); // переход на страницу товаров
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
                <img src={illustration} alt="Illustration" className="login-image" />
            </div>
        </div>
    );
}
