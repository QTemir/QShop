// frontend/src/Client/ClientApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import ShopProvider from './context/ShopContext';

export default function ClientApp() {
    const { clientSiteName } = useParams(); // имя параметра в App.jsx
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (!clientSiteName) return;
        fetch(`http://localhost:5000/api/clients/byDomain/${clientSiteName}`)
            .then(res => res.json())
            .then(data => setClient(data))
            .catch(err => {
                console.error(err);
            });
    }, [clientSiteName]);

    if (!client) return <div style={{ padding: 20 }}>Загрузка клиентского сайта...</div>;

    return (
        <ShopProvider client={client}>
            <div className="flex">
                <Sidebar client={client} />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="admin" element={<Admin client={client} />} />
                        <Route path="settings" element={<Settings client={client} />} />
                        <Route path="stats" element={<Stats client={client} />} />
                        <Route path="*" element={<Navigate to="admin" replace />} />
                    </Routes>
                </div>
            </div>
        </ShopProvider>
    );
}
