// src/Moderator/AdminPanel.jsx
import React, { useState, useMemo } from "react";
import "./Admin_panel.css";

export default function AdminPanel() {

  const initialClients = [
    {
      id: 1,
      shop: "PaperMoon Store",
      periodFrom: "2025-01-01",
      periodTo: "2025-12-31",
      payment: "Оплатил",
      domain: "papermoon.example",
    },
    {
      id: 2,
      shop: "GreenCraft",
      periodFrom: "2025-04-10",
      periodTo: "2025-07-10",
      payment: "Пробный период",
      domain: "greencraft.example",
    },
    {
      id: 3,
      shop: "UrbanStyle",
      periodFrom: "2024-10-01",
      periodTo: "2025-10-01",
      payment: "Оплатил",
      domain: "urbanstyle.example",
    },
  ];

  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    shop: "",
    periodFrom: "",
    periodTo: "",
    payment: "Оплатил",
    domain: ""
  });
  const [sort, setSort] = useState({ key: "shop", dir: "asc" });

  // сортировка таблицы
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();

    let list = clients.filter((c) =>
        c.shop.toLowerCase().includes(s)
    );

    list.sort((a, b) => {
      const key = sort.key;

      let va = a[key];
      let vb = b[key];

      if (key.includes("period")) {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }

      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [clients, search, sort]);

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить клиента?")) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.shop || !form.periodFrom || !form.periodTo || !form.domain) {
      alert("Все поля должны быть заполнены");
      return;
    }

    const newClient = {
      id: Date.now(),
      ...form
    };

    setClients((prev) => [newClient, ...prev]);

    setForm({
      shop: "",
      periodFrom: "",
      periodTo: "",
      payment: "Оплатил",
      domain: ""
    });
  };

  return (
      <div className="admin-root">

        <div className="admin-container">

          <h1 className="admin-title">Панель модератора</h1>

          {/* ПОИСК */}
          <div className="search-box">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию магазина"
            />
          </div>

          {/* ФОРМА ДОБАВЛЕНИЯ */}
          <div className="card">
            <form className="form" onSubmit={handleAdd}>
              <input
                  value={form.shop}
                  onChange={(e) => setForm({ ...form, shop: e.target.value })}
                  placeholder="Название магазина"
              />
              <input
                  type="date"
                  value={form.periodFrom}
                  onChange={(e) => setForm({ ...form, periodFrom: e.target.value })}
              />
              <input
                  type="date"
                  value={form.periodTo}
                  onChange={(e) => setForm({ ...form, periodTo: e.target.value })}
              />
              <select
                  value={form.payment}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
              >
                <option>Оплатил</option>
                <option>Пробный период</option>
              </select>
              <input
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  placeholder="Домен"
              />

              <button type="submit">Добавить</button>
            </form>
          </div>

          {/* ТАБЛИЦА */}
          <div className="card table-card">
            <table>
              <thead>
              <tr>
                <th onClick={() => toggleSort("shop")}>
                  Магазин
                </th>
                <th onClick={() => toggleSort("periodFrom")}>
                  Период
                </th>
                <th onClick={() => toggleSort("payment")}>
                  Оплата
                </th>
                <th onClick={() => toggleSort("domain")}>
                  Домен
                </th>
                <th>Действия</th>
              </tr>
              </thead>

              <tbody>
              {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.shop}</td>
                    <td>{c.periodFrom} — {c.periodTo}</td>
                    <td>
                                        <span className={c.payment === "Оплатил" ? "payment-ok" : "payment-warn"}>
                                            {c.payment}
                                        </span>
                    </td>
                    <td>{c.domain}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(c.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
              ))}

              {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                      Клиенты не найдены
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
  );
}
