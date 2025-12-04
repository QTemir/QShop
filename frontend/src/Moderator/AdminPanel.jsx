// src/Moderator/AdminPanel.jsx
import React, { useState, useMemo, useEffect } from "react";
import "./Admin_panel.css";

export default function AdminPanel() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    shop: "",
    periodFrom: "",
    periodTo: "",
    payment: "Оплатил",
    domain: ""
  });
  const [sort, setSort] = useState({ key: "shop", dir: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      // Если пришёл объект с ключом clients, используем его
      const clientsArray = Array.isArray(data) ? data : data.clients ?? [];
      setClients(clientsArray);

    } catch (err) {
      console.error("Ошибка загрузки клиентов:", err);
      setClients([]); // на случай ошибки, чтобы не падало
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.shop || !form.periodFrom || !form.periodTo || !form.domain) {
      alert("Все поля должны быть заполнены");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка добавления клиента");
        setLoading(false);
        return;
      }

      // Новый объект клиента: все данные + login и password
      const newClient = {
        ...data.client,
        login: data.login,
        password: data.password
      };

      setClients(prev => [newClient, ...prev]);

      alert(`Клиент создан!\nЛогин: ${data.login}\nПароль: ${data.password}`);

      setForm({
        shop: "",
        periodFrom: "",
        periodTo: "",
        payment: "Оплатил",
        domain: ""
      });

    } catch (err) {
      console.error("Ошибка добавления клиента:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить клиента?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      loadClients();
    } catch (err) {
      console.error("Ошибка удаления клиента:", err);
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(clients)) return [];
    const s = search.toLowerCase().trim();
    let list = clients.filter((c) =>
        (c.shop ?? "").toLowerCase().includes(s)
    );

    list.sort((a, b) => {
      const key = sort.key;

      let va, vb;
      if (key.includes("period")) {
        va = a[key] ? new Date(a[key]).getTime() : 0;
        vb = b[key] ? new Date(b[key]).getTime() : 0;
      } else {
        va = (a[key] ?? "").toString().toLowerCase();
        vb = (b[key] ?? "").toString().toLowerCase();
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

  return (
      <div className="admin-root">
        <div className="admin-container">
          <h1 className="admin-title">Панель модератора</h1>

          <div className="search-box">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию магазина"
            />
          </div>

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
                  placeholder="Домен (например greencraft)"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Добавляем..." : "Добавить"}
              </button>
            </form>
            {error && <div className="login-error">{error}</div>}
          </div>

          <div className="card table-card">
            <table>
              <thead>
              <tr>
                <th onClick={() => toggleSort("shop")}>Магазин</th>
                <th onClick={() => toggleSort("periodFrom")}>Период</th>
                <th onClick={() => toggleSort("payment")}>Оплата</th>
                <th onClick={() => toggleSort("domain")}>Домен</th>
                <th>Логин</th>
                <th>Пароль</th>
                <th>Действия</th>
              </tr>
              </thead>

              <tbody>
              {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.shop ?? "---"}</td>
                    <td>
                      {(c.periodFrom ? c.periodFrom.slice(0, 10) : "---")} — {(c.periodTo ? c.periodTo.slice(0, 10) : "---")}
                    </td>
                    <td>
                      <span className={c.payment === "Оплатил" ? "payment-ok" : "payment-warn"}>
                        {c.payment ?? "---"}
                      </span>
                    </td>
                    <td>{c.domain ?? "---"}</td>
                    <td>{c.login ?? "---"}</td>
                    <td>{c.password ?? "---"}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(c.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
              ))}

              {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{textAlign: "center", padding: "20px"}}>
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
