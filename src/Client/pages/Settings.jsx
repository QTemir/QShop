import React, { useState, useEffect, useRef } from "react";
import { useShop } from "../context/ShopContext";

const Settings = () => {
  const { settings, setSettings } = useShop();
  const [name, setName] = useState(settings?.name || "");
  const [instagram, setInstagram] = useState(settings?.instagram || "");
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp || "");
  const [theme, setTheme] = useState(settings?.theme || "default");
  const [logoPreview, setLogoPreview] = useState(settings?.logo || null);
  const fileRef = useRef();

  useEffect(() => {
    setName(settings?.name || "");
    setInstagram(settings?.instagram || "");
    setWhatsapp(settings?.whatsapp || "");
    setTheme(settings?.theme || "default");
    setLogoPreview(settings?.logo || null);
  }, [settings]);

  const handleLogo = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings((prev) => ({
      ...prev,
      name,
      instagram,
      whatsapp,
      theme,
      logo: logoPreview,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Настройки магазина</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Название</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Instagram (ссылка или ник)
          </label>
          <input
            className="w-full p-2 border rounded"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            WhatsApp (номер)
          </label>
          <input
            className="w-full p-2 border rounded"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Логотип</label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="logo"
                className="h-16 w-16 object-contain rounded"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-sm">
                Нет
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogo(e.target.files?.[0])}
            />
            <button
              type="button"
              className="btn-gradient"
              onClick={() => fileRef.current?.click()}
            >
              Выбрать файл
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Тема</label>
          <select
            className="w-full p-2 border rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="default">По умолчанию</option>
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-gradient">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
