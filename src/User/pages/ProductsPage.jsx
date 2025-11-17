import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProductCard from "../components/ProductCard";
import sampleProducts from "../data/sampleProducts";
import "./ProductsPage.css";

export default function ProductsPage() {
    const [category] = useState(null);
    const categories = [
        { name: "Lorem Ipsum", count: 21 },
        { name: "Lorem Ipsum", count: 32 },
        { name: "Lorem Ipsum", count: 13 },
        { name: "Lorem Ipsum", count: 14 },
        { name: "Lorem Ipsum", count: 6 },
        { name: "Lorem Ipsum", count: 11 },
    ];

    return (
        <div className="page-root">
            <Sidebar categories={categories} />
            <div className="page-main">
                <Topbar title="Верхняя одежда" />
                <main className="page-content">
                    <div className="grid">
                        {sampleProducts.map((p) => (
                            <ProductCard product={p} key={p.id} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
