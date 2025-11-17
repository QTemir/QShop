import React from "react";
import { NavLink } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Icon = ({ name }) => {
  if (name === "admin")
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z"
          fill="currentColor"
        />
      </svg>
    );
  if (name === "settings")
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zM19.4 12a7.4 7.4 0 0 0-.1-1l2.1-1.7-2-3.5-2.5 1a7.2 7.2 0 0 0-1.8-1L14 1H10L9 4.3a7.2 7.2 0 0 0-1.8 1L5.7 4.3 3.7 7.8l2.1 1.7c-.1.3-.1.7-.1 1s0 .7.1 1L3.7 12.7l2 3.5 2.5-1c.5.4 1.1.8 1.8 1L10 23h4l1-3.3c.7-.2 1.3-.6 1.8-1l2.5 1 2-3.5-2.1-1.7c.1-.3.1-.7.1-1z"
          fill="currentColor"
        />
      </svg>
    );
  if (name === "stats")
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M3 3v18h18" stroke="currentColor" />
        <path d="M7 13v6" stroke="currentColor" />
        <path d="M12 9v10" stroke="currentColor" />
        <path d="M17 5v14" stroke="currentColor" />
      </svg>
    );
  return null;
};

const Sidebar = () => {
  const { settings } = useShop();

  const linkBase = "flex items-center gap-3 p-2 rounded transition-colors";
  const activeClass =
    "bg-gradient-to-r from-[#0C1CFF] to-[#3EFFD8] text-white shadow-md ring-1 ring-indigo-200";

  return (
    <aside className="w-64 bg-white min-h-screen border-r p-4">
      <div className="mb-6 flex items-center gap-3">
        {/* Показываем логотип (если есть) и название магазина */}
        {settings?.logo ? (
          <img
            src={settings.logo}
            alt="Логотип"
            className="h-10 w-10 object-contain rounded"
          />
        ) : (
          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
            Лого
          </div>
        )}
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {settings?.name || "Панель администратора"}
          </div>
          <div className="text-xs text-gray-500">
            {settings?.instagram ? `@${settings.instagram}` : ""}
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/client/admin"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? activeClass : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <Icon name="admin" />
          <span className="text-sm">Товары</span>
        </NavLink>

        <NavLink
          to="/client/settings"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? activeClass : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <Icon name="settings" />
          <span className="text-sm">Настройки</span>
        </NavLink>

        <NavLink
          to="/client/stats"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? activeClass : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          <Icon name="stats" />
          <span className="text-sm">Статистика</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
