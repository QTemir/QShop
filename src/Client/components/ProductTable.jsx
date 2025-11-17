import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import formatCurrency from "../utils/formatCurrency";

const ProductTable = () => {
  const { products, markSold, editQuantity, removeProduct } = useShop();
  const [viewer, setViewer] = useState({ open: false, product: null, idx: 0 });
  const [sellAmounts, setSellAmounts] = useState({}); // { [id]: number }

  const openViewer = (product, idx = 0) =>
    setViewer({ open: true, product, idx });
  const closeViewer = () => setViewer({ open: false, product: null, idx: 0 });

  const handleSellAmountChange = (id, v) =>
    setSellAmounts((prev) => ({ ...prev, [id]: Math.max(0, Number(v || 0)) }));

  const handleSell = (id) => {
    const qty = Number(sellAmounts[id] || 0);
    if (!qty || qty <= 0) return;
    markSold(id, qty);
    setSellAmounts((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow-sm mt-4">
        <h2 className="text-lg font-semibold mb-3">Товары</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th>Изо</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Параметры</th>
              <th>Кол-во</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 w-20">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-16 w-16 object-cover rounded cursor-pointer"
                      onClick={() => openViewer(p, 0)}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                      Нет
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {p.name}
                  <div className="text-xs text-gray-500">{p.description}</div>
                </td>
                <td className="py-2">{formatCurrency(p.price)}</td>
                <td className="py-2">
                  {p.params?.map((pp, i) => (
                    <div key={i} className="text-xs text-gray-600">
                      {pp.key} — {pp.value}
                    </div>
                  ))}
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={p.quantity}
                      min="0"
                      onChange={(e) => editQuantity(p.id, e.target.value)}
                      className="w-20 p-1 border rounded text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        className="w-20 p-1 border rounded text-sm"
                        type="number"
                        min="0"
                        placeholder="шт"
                        value={sellAmounts[p.id] || ""}
                        onChange={(e) =>
                          handleSellAmountChange(p.id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleSell(p.id)}
                        disabled={(p.quantity || 0) <= 0}
                        className="btn-gradient px-3 py-1 rounded text-sm"
                      >
                        Продать
                      </button>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  {(p.quantity || 0) === 0 ? (
                    <span className="text-green-600">Продано</span>
                  ) : (
                    <span className="text-yellow-600">В наличии</span>
                  )}
                </td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="btn-red-gradient px-3 py-1 rounded text-sm"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewer.open && viewer.product && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeViewer}
        >
          <div
            className="bg-white rounded shadow-lg max-w-3xl w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">{viewer.product.name}</div>
              <div className="space-x-2">
                <button
                  onClick={() =>
                    setViewer((v) => ({ ...v, idx: Math.max(0, v.idx - 1) }))
                  }
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  ◀
                </button>
                <button
                  onClick={() =>
                    setViewer((v) => ({
                      ...v,
                      idx: Math.min(
                        viewer.product.images.length - 1,
                        v.idx + 1
                      ),
                    }))
                  }
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  ▶
                </button>
                <button
                  onClick={closeViewer}
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={viewer.product.images[viewer.idx]}
                alt=""
                className="max-h-[60vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
