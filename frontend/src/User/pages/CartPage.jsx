// src/pages/CartPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sampleProducts from "../data/sampleProducts";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import "./CartPage.css";

/*
  Простая логика корзины на клиенте:
  - cartItems: массив { id, productId, qty, size?, color? }
  - поддержка увеличения/уменьшения кол-ва, удаления
  - подсчёт суммы
*/

const initialCart = [
    { id: "c1", productId: "p1", qty: 1, size: "XL", color: "Белый" },
    { id: "c2", productId: "p2", qty: 1, size: "M", color: "Red" },
    { id: "c3", productId: "p3", qty: 1, size: "L", color: "Blue" },
];

export default function CartPage() {
    const [cart, setCart] = useState(initialCart);

    // Hooks for recommendations visibility
    const recsAnchorRef = useRef(null);
    const [showRecs, setShowRecs] = useState(false);

    useEffect(() => {
        const el = recsAnchorRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShowRecs(true);
            },
            { threshold: 0.25 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const updateQty = (cartId, delta) => {
        setCart((prev) =>
            prev.map((it) =>
                it.id === cartId ? { ...it, qty: Math.max(1, it.qty + delta) } : it
            )
        );
    };

    const removeItem = (cartId) => {
        setCart((prev) => prev.filter((it) => it.id !== cartId));
    };

    const itemsDetailed = cart.map((it) => {
        const product = sampleProducts.find((p) => p.id === it.productId);
        return { ...it, product };
    });

    const total = useMemo(() => {
        return itemsDetailed.reduce((sum, it) => {
            const price =
                parseInt(
                    String((it.product?.price || "0").replace(/\s/g, "").replace(/[^\d]/g, "")
                    ) || 0);
            return sum + price * (it.qty || 1);
        }, 0);
    }, [itemsDetailed]);

    // recommendations (исключаем те, что в корзине)
    const recommendations = sampleProducts.filter(
        (p) => !cart.some((c) => c.productId === p.id)
    );

    const handleWhatsApp = () => {
        const text = itemsDetailed
            .map(
                (it, idx) =>
                    `${idx + 1}. ${it.product?.title || "—"} — ${it.qty} шт — ${
                        it.size || ""
                    } ${it.color || ""}`
            )
            .join("\n");
        const msg = `Заказ:\n${text}\nИтого: ${total} ₸`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="page-layout">
            <Sidebar />

            <div className="main-content">
                <Topbar title="Корзина" />

                <div className="cart-root">
                    <div className="cart-container">
                        <h1 className="cart-title">КОРЗИНА</h1>

                        <div className="cart-grid">
                            {/* Список товаров */}
                            <div className="cart-items-col">
                                <div className="cart-items-card">
                                    {itemsDetailed.length === 0 ? (
                                        <div className="cart-empty">Корзина пуста</div>
                                    ) : (
                                        itemsDetailed.map((it) => (
                                            <div className="cart-item" key={it.id}>
                                                <div className="cart-item-left">
                                                    <div className="cart-thumb">
                                                        <img
                                                            src={
                                                                it.product?.images?.[0] ||
                                                                it.product?.image ||
                                                                ""
                                                            }
                                                            alt={it.product?.title || ""}
                                                        />
                                                    </div>
                                                    <div className="cart-meta">
                                                        <div className="cart-name">{it.product?.title}</div>
                                                        <div className="cart-attrs">
                                                            <span>Размер: {it.size || "—"}</span>
                                                            <span>Цвет: {it.color || "—"}</span>
                                                        </div>
                                                        <div className="cart-price">
                                                            {it.product?.price} ₸
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="cart-item-right">
                                                    <div className="qty-controls">
                                                        <button
                                                            onClick={() => updateQty(it.id, -1)}
                                                            className="qty-btn"
                                                        >
                                                            −
                                                        </button>
                                                        <div className="qty-value">{it.qty}</div>
                                                        <button
                                                            onClick={() => updateQty(it.id, +1)}
                                                            className="qty-btn"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        className="cart-remove"
                                                        onClick={() => removeItem(it.id)}
                                                        aria-label="удалить"
                                                    >
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M3 6h18"
                                                                stroke="#ff4d4f"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
                                                                stroke="#ff4d4f"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M10 11v6M14 11v6"
                                                                stroke="#ff4d4f"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Итог */}
                            <aside className="cart-summary-col">
                                <div className="cart-summary-card">
                                    <div className="summary-row">
                                        <div className="summary-label">Сумма заказа</div>
                                        <div className="summary-value">{total} ₸</div>
                                    </div>

                                    <button className="summary-cta" onClick={handleWhatsApp}>
                                        ПЕРЕЙТИ В WHATSAPP →
                                    </button>
                                </div>
                            </aside>
                        </div>

                        {/* Рекомендации (слайдер) */}
                        <div ref={recsAnchorRef} style={{ height: 1 }} />
                        <section className="pd-recommendations">
                            <h2 className="pd-recs-title">Тебе понравится</h2>
                            {showRecs && (
                                <div className="pd-recs-slider-wrapper">
                                    <button
                                        className="pd-recs-arrow left"
                                        onClick={() => {
                                            const row = document.querySelector(".pd-recs-row");
                                            row.scrollBy({ left: -300, behavior: "smooth" });
                                        }}
                                    >
                                        ‹
                                    </button>

                                    <div className="pd-recs-row">
                                        {recommendations.map((p) => (
                                            <Link
                                                to={`/product/${p.id}`}
                                                className="pd-rec-card"
                                                key={p.id}
                                            >
                                                <div className="pd-rec-img-wrap">
                                                    <img src={p.images?.[0]} alt={p.title} />
                                                </div>
                                                <div className="pd-rec-info">
                                                    <div className="pd-rec-title">{p.title}</div>
                                                    <div className="pd-rec-price">{p.price} ₸</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <button
                                        className="pd-recs-arrow right"
                                        onClick={() => {
                                            const row = document.querySelector(".pd-recs-row");
                                            row.scrollBy({ left: 300, behavior: "smooth" });
                                        }}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
