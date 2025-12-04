// frontend/src/Client/pages/Admin.jsx
import React, { useState, useEffect } from "react";

export default function Admin({ client }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!client) return;
        fetch(`http://localhost:5000/api/products/byClient/${client.id}`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, [client]);

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/products/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: client.id,
                    name,
                    description,
                    price,
                    quantity: 1,
                    images: []
                })
            });
            const data = await res.json();
            setProducts(prev => [data.product, ...prev]);
            setName(""); setPrice(0); setDescription("");
        } catch (err) {
            console.error(err);
            alert("Ошибка добавления");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Товары вашего магазина</h2>

            <form onSubmit={addProduct} className="space-y-2 mb-4">
                <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
                <input type="number" placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded" />
                <div className="flex justify-end">
                    <button className="btn-gradient" type="submit">Добавить товар</button>
                </div>
            </form>

            <div className="bg-white p-4 rounded shadow-sm">
                {products.length === 0 && <div>Товаров пока нет</div>}
                <ul>
                    {products.map(p => (
                        <li key={p.id} className="py-2 border-b">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-gray-600">{p.description}</div>
                            <div className="text-sm">{p.price} USD • {p.quantity} шт</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
