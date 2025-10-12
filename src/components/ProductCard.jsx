import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    return (
        <div className="pcard">
            <Link to={`/product/${product.id}`} className="pcard-link">
                <div className="pcard-img-wrap">
                    <img src={product.image} alt={product.title} />
                </div>
            </Link>

            {/* Цена + Плюсик в одной строке */}
            <div className="pcard-body">
                <div className="pcard-price">{product.price} ₸</div>
                <button className="pcard-add">+</button>
            </div>

            {/* Название товара ниже */}
            <div className="pcard-title">{product.title}</div>
        </div>
    );
}
