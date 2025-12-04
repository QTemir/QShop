import React, { createContext, useContext, useState, useMemo } from "react";

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

const initialProducts = [
  {
    id: 1,
    name: "Шерстяной шарф",
    description: "Тёплый",
    price: 1200,
    params: [{ key: "Материал", value: "Шерсть" }],
    quantity: 5,
    sold: false,
    images: [],
  },
  {
    id: 2,
    name: "Казахстанский коврик",
    description: "Ручная работа",
    price: 3500,
    params: [{ key: "Изготовлен", value: "Казахстан" }],
    quantity: 0,
    sold: true,
    images: [],
  },
];

export default function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [settings, setSettings] = useState({
    name: "Магазин",
    instagram: "",
    whatsapp: "",
    theme: "default",
    logo: null, // dataURL
  });
  const [sales, setSales] = useState([]); // { productId, name, qty, revenue, date }

  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(),
        sold: (product.quantity || 0) <= 0 ? true : false,
      },
    ]);
  };

  // markSold: уменьшает quantity на qty (по умолчанию 1), добавляет запись в sales, помечает sold если quantity === 0
  const markSold = (id, qty = 1) => {
    setProducts((prev) => {
      return prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, Number(p.quantity || 0) - qty);
        // add sale record
        setSales((s) => [
          ...s,
          {
            productId: p.id,
            name: p.name,
            qty,
            revenue: Number(p.price || 0) * qty,
            date: new Date().toISOString(),
          },
        ]);
        return { ...p, quantity: newQty, sold: newQty === 0 };
      });
    });
  };

  const editQuantity = (id, newQty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(0, Number(newQty || 0)),
              sold: Number(newQty || 0) === 0,
            }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce(
      (s, p) => s + Number(p.quantity || 0),
      0
    );
    const totalSalesItems = sales.reduce((s, item) => s + item.qty, 0);
    const totalRevenue = sales.reduce((s, item) => s + item.revenue, 0);
    const avgPrice = totalProducts
      ? Math.round(
          products.reduce((s, p) => s + Number(p.price || 0), 0) / totalProducts
        )
      : 0;
    return {
      totalProducts,
      totalStock,
      totalSalesItems,
      totalRevenue,
      avgPrice,
    };
  }, [products, sales]);

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        markSold,
        editQuantity,
        removeProduct,
        settings,
        setSettings,
        stats,
        sales,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
