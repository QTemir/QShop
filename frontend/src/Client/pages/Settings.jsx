// frontend/src/Client/pages/Settings.jsx
import React, { useState, useEffect } from "react";

export default function Settings({ client }) {
  const [shop, setShop] = useState(client?.shop || "");
  const [logo, setLogo] = useState(client?.logo || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShop(client?.shop || "");
    setLogo(client?.logo || "");
  }, [client]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/clients/update/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, logo })
      });
      const data = await res.json();
      alert("Сохранено");
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Настройки магазина</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Название</label>
            <input className="w-full p-2 border rounded" value={shop} onChange={(e) => setShop(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Логотип (URL или dataURL)</label>
            <input className="w-full p-2 border rounded" value={logo} onChange={(e) => setLogo(e.target.value)} />
            <div className="mt-2">
              {logo ? <img src={logo} alt="logo" className="h-20" /> : <div className="h-20 w-40 bg-gray-100 flex items-center justify-center">Нет</div>}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn-gradient" onClick={handleSave} disabled={loading}>{loading ? "Сохраняем..." : "Сохранить"}</button>
          </div>
        </div>
      </div>
  );
}
