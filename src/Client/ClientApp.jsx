import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Sidebar from './components/Sidebar';
import ShopProvider from './context/ShopContext';

export default function ClientApp() {
    return (
        <ShopProvider>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="admin" element={<Admin />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="stats" element={<Stats />} />
                        <Route path="*" element={<Navigate to="admin" replace />} />
                    </Routes>
                </div>
            </div>
        </ShopProvider>
    );
}
