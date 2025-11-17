import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Admin from "../pages/Admin";
import Settings from "../pages/Settings";
import Stats from "../pages/Stats";

const ClientApp = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">
                <Routes>
                    <Route path="/client/admin" element={<Admin />} />
                    <Route path="/client/settings" element={<Settings />} />
                    <Route path="/client/stats" element={<Stats />} />
                    <Route path="*" element={<Navigate to="/client/admin" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default ClientApp;
