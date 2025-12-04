import React, { useState, useRef } from "react";
import { useShop } from "../context/ShopContext";

const ProductForm = () => {
  const { addProduct } = useShop();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]);
  const fileRef = useRef();

  const handleParamChange = (index, field, value) =>
    setParams((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  const addParam = () => setParams((prev) => [...prev, { key: "", value: "" }]);
  const removeParam = (index) =>
    setParams((prev) => prev.filter((_, i) => i !== index));

  const handleFiles = (files) => {
    const arr = Array.from(files);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedParams = params.filter((p) => p.key.trim() || p.value.trim());
    addProduct({
      name,
      description,
      price: Number(price || 0),
      params: cleanedParams,
      images,
      quantity: Number(quantity || 0),
    });
    // reset
    setName("");
    setDescription("");
    setPrice("");
    setQuantity(1);
    setParams([{ key: "", value: "" }]);
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Добавить товар</h2>

      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Количество"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium mb-1">Параметры</label>
        {params.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={p.key}
              onChange={(e) => handleParamChange(i, "key", e.target.value)}
              placeholder="Ключ"
              className="flex-1 p-2 border rounded"
            />
            <input
              value={p.value}
              onChange={(e) => handleParamChange(i, "value", e.target.value)}
              placeholder="Значение"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeParam(i)}
              className="px-3 rounded bg-gray-200"
            >
              −
            </button>
          </div>
        ))}
        <button type="button" onClick={addParam} className="mt-1 btn-gradient">
          Добавить параметр
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">
          Изображения (несколько)
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          className="btn-gradient"
          onClick={() => fileRef.current?.click()}
        >
          Выбрать файлы
        </button>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt=""
                className="h-20 w-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1 -right-1 bg-white rounded-full shadow text-sm px-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-gradient">
          Добавить товар
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
