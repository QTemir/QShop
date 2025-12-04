// frontend/src/Client/components/Sidebar.jsx
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Icon = ({ name }) => {
    if (name === "admin") return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">...</svg>;
    if (name === "settings") return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">...</svg>;
    if (name === "stats") return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">...</svg>;
    return null;
};

const Sidebar = ({ client }) => {
    const { settings } = useShop();
    const { clientSiteName } = useParams();

    const linkBase = "flex items-center gap-3 p-2 rounded transition-colors";
    const activeClass =
        "bg-gradient-to-r from-[#0C1CFF] to-[#3EFFD8] text-white shadow-md ring-1 ring-indigo-200";

    return (
        <aside className="w-64 bg-white min-h-screen border-r p-4">
            <div className="mb-6 flex items-center gap-3">
                {client?.logo ? (
                    <img src={client.logo} alt="Логотип" className="h-10 w-10 object-contain rounded" />
                ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">Лого</div>
                )}
                <div>
                    <div className="text-lg font-semibold text-gray-800">{client.shop || settings?.name || "Магазин"}</div>
                    <div className="text-xs text-gray-500">{settings?.instagram ? `@${settings.instagram}` : ""}</div>
                </div>
            </div>

            <nav className="flex flex-col space-y-2">
                <NavLink to={`/client/${clientSiteName}/admin`} className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700 hover:bg-gray-50"}`}>
                    <Icon name="admin" />
                    <span className="text-sm">Товары</span>
                </NavLink>

                <NavLink to={`/client/${clientSiteName}/settings`} className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700 hover:bg-gray-50"}`}>
                    <Icon name="settings" />
                    <span className="text-sm">Настройки</span>
                </NavLink>

                <NavLink to={`/client/${clientSiteName}/stats`} className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700 hover:bg-gray-50"}`}>
                    <Icon name="stats" />
                    <span className="text-sm">Статистика</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
