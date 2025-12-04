// src/pages/ProductDetail.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import sampleProducts from "../data/sampleProducts";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import "./ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const product = sampleProducts.find((p) => p.id === id);

    const [index, setIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState(null);
    const [showRecs, setShowRecs] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const startX = useRef(null);
    const recsAnchorRef = useRef(null);

    useEffect(() => setIndex(0), [id]);

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

    if (!product) {
        return (
            <div className="page-layout">
                <Sidebar />
                <div className="main-content">
                    <Topbar title="Карточка товара" />
                    <div className="pd-empty container" style={{ padding: 40 }}>
                        <h2>Товар не найден</h2>
                        <Link to="/products">Вернуться в каталог</Link>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.images || [];
    const recommendations = (product.recommendations || [])
        .map((rid) => sampleProducts.find((p) => p.id === rid))
        .filter(Boolean);

    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(images.length - 1, i + 1));
    const decQty = () => setQty((q) => Math.max(1, q - 1));
    const incQty = () => setQty((q) => q + 1);

    const onTouchStart = (e) => (startX.current = e.touches?.[0]?.clientX ?? null);
    const onTouchEnd = (e) => {
        if (startX.current == null) return;
        const dx = (e.changedTouches?.[0]?.clientX ?? 0) - startX.current;
        if (dx > 50) prev();
        else if (dx < -50) next();
        startX.current = null;
    };

    const handleAdd = () => {
        // имитация добавления в корзину
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="page-layout">
            <Sidebar />

            <div className="main-content">
                <Topbar title="Карточка товара" />

                <div className="pd-root">
                    <div className="pd-container">
                        <div className="pd-breadcrumbs">
                            <Link to="/products">Каталог</Link>
                            <span> / </span>
                            <span>{product.title}</span>
                        </div>

                        <div className="pd-main-grid">
                            {/* мини-превью */}
                            <div className="pd-thumbs">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        className={`pd-thumb ${i === index ? "active" : ""}`}
                                        onClick={() => setIndex(i)}
                                        style={{ backgroundImage: `url(${src})` }}
                                    />
                                ))}
                            </div>

                            {/* главное изображение */}
                            <div className="pd-media">
                                <div
                                    className="pd-slider"
                                    onTouchStart={onTouchStart}
                                    onTouchEnd={onTouchEnd}
                                >
                                    <div
                                        className="pd-strip"
                                        style={{ transform: `translateX(-${index * 100}%)` }}
                                    >
                                        {images.map((src, i) => (
                                            <div className="pd-slide" key={i}>
                                                <img src={src} alt={`${product.title} ${i + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pd-controls">
                                    <button className="pd-arrow" onClick={prev} disabled={index === 0}>
                                        ‹
                                    </button>
                                    <div className="pd-dots">
                                        {images.map((_, i) => (
                                            <button
                                                key={i}
                                                className={`pd-dot ${i === index ? "active" : ""}`}
                                                onClick={() => setIndex(i)}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="pd-arrow"
                                        onClick={next}
                                        disabled={index === images.length - 1}
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>

                            {/* инфо */}
                            <aside className="pd-info">
                                <h1 className="pd-title">{product.title}</h1>
                                <div className="pd-price-row">
                                    <div className="pd-price">{product.price} ₸</div>
                                </div>

                                <p className="pd-description">{product.short}</p>

                                <div className="pd-buy-row">
                                    <div className="pd-qty">
                                        <button className="qty-btn" onClick={decQty}>−</button>
                                        <div className="qty-value">{qty}</div>
                                        <button className="qty-btn" onClick={incQty}>+</button>
                                    </div>

                                    <button className="pd-add-to-cart" onClick={handleAdd}>
                                        В корзину
                                    </button>
                                </div>
                            </aside>
                        </div>

                        {/* рекомендации */}
                        <div ref={recsAnchorRef} style={{ height: 1 }} />
                        <section className="pd-recommendations">
                            <h2 className="pd-recs-title">Тебе понравится</h2>
                            {showRecs && (
                                <div className="pd-recs-row">
                                    {recommendations.map((p) => (
                                        <Link to={`/product/${p.id}`} className="pd-rec-card" key={p.id}>
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
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* ✅ Всплывающее уведомление */}
            {showToast && (
                <div className="toast">
                    <span>✅ {product.title} добавлен в корзину</span>
                    <button
                        className="toast-btn"
                        onClick={() => navigate("/cart")}
                    >
                        Перейти в корзину
                    </button>
                </div>
            )}
        </div>
    );
}
