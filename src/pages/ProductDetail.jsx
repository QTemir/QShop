import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import sampleProducts from "../data/sampleProducts";
import "./ProductDetail.css";

const findProductById = (id) => sampleProducts.find((p) => p.id === id) || null;

export default function ProductDetail() {
    const { id } = useParams();

    // хуки ВСЕГДА в самом начале
    const [index, setIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const startX = useRef(null);
    const recsAnchorRef = useRef(null);
    const [showRecs, setShowRecs] = useState(false);

    const product = findProductById(id);

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

    // защита: если нет продукта
    if (!product) {
        return (
            <div className="pd-empty container" style={{ padding: 40 }}>
                <h2>Товар не найден</h2>
                <Link to="/products">Вернуться в каталог</Link>
            </div>
        );
    }

    const images = product.images || [];
    const recommendations = (product.recommendations || [])
        .map((rid) => sampleProducts.find((p) => p.id === rid))
        .filter(Boolean);

    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(images.length - 1, i + 1));
    const changeThumb = (i) => setIndex(i);
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
        alert(`Добавлено в корзину: ${product.title} — ${qty} шт.`);
    };

    return (
        <div className="pd-root">
            <div className="pd-container">
                <div className="pd-breadcrumbs">
                    <Link to="/products">Каталог</Link>
                    <span> / </span>
                    <span>{product.title}</span>
                </div>

                <div className="pd-main-grid">
                    {/* mini-thumbs */}
                    <div className="pd-thumbs">
                        {images.map((src, i) => (
                            <button
                                key={i}
                                className={`pd-thumb ${i === index ? "active" : ""}`}
                                onClick={() => changeThumb(i)}
                                style={{ backgroundImage: `url(${src})` }}
                            />
                        ))}
                    </div>

                    {/* main image */}
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
                                        <img src={src} alt={`${product.title} ${i + 1}`} draggable={false} />
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

                    {/* info block */}
                    <aside className="pd-info">
                        <h1 className="pd-title">{product.title}</h1>
                        <div className="pd-price-row">
                            <div className="pd-price">{product.price} ₸</div>
                        </div>

                        <p className="pd-description">{product.short}</p>

                        <div className="pd-colors-sizes">
                            <div className="pd-colors">
                                <div className="pd-label">Цвета</div>
                                <div className="pd-color-list">
                                    {(product.colors || ["#6B6B54", "#1F7A66", "#2B3A62"]).map((c, i) => (
                                        <button
                                            key={i}
                                            className={`pd-color ${selectedColor === c ? "selected" : ""}`}
                                            onClick={() => setSelectedColor(c)}
                                            style={{ background: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pd-sizes">
                                <div className="pd-label">Размеры</div>
                                <div className="pd-size-list">
                                    {["XS", "S", "M", "L", "XL"].map((s) => (
                                        <button
                                            key={s}
                                            className={`pd-size ${selectedSize === s ? "selected" : ""}`}
                                            onClick={() => setSelectedSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

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

                        <div className="pd-desc-specs">
                            <h3>Описание</h3>
                            <p>{product.description}</p>
                        </div>
                    </aside>
                </div>

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
    );
}
