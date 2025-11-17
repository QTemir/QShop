// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ categories = [], onCategoryClick }) {
    const navigate = useNavigate();

    return (
        <aside className="sb-root">
            <div className="sb-top">
                <div className="sb-logo">Arik</div>
            </div>

            <div className="sb-buttons">
                <button className="sb-all-btn" onClick={() => navigate("/products")}>
                    ВСЕ ТОВАРЫ
                </button>
            </div>

            <div className="sb-section">
                <h4 className="sb-section-title">Категории</h4>
                <ul className="sb-cats">
                    {categories.map((c, i) => (
                        <li
                            key={c.name}
                            className="sb-cat-item"
                            onClick={() => onCategoryClick?.(c)}
                        >
                            <span>{c.name}</span>
                            <span className="sb-badge">{c.count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sb-footer">
                <button className="sb-cart-btn" onClick={() => navigate("/cart")}>
                    КОРЗИНА
                </button>
            </div>
        </aside>
    );
}
