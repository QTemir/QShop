import React, { useMemo, useState } from "react";
import { useShop } from "../context/ShopContext";
import formatCurrency from "../utils/formatCurrency";

/* Гистограмма — с плавной анимацией и читаемыми числами */
const Histogram = ({ data = [], labels = [], maxHeight = 160 }) => {
  const fullH = maxHeight - 50;
  const max = Math.max(...data, 1);
  const useLog = max > 100;

  return (
    <svg
      width="100%"
      height={maxHeight}
      viewBox={`0 0 600 ${maxHeight}`}
      className="rounded bg-white"
    >
      {data.map((c, i) => {
        const cols = Math.max(data.length, 1);
        const x = 20 + i * (520 / cols);
        const w = Math.max(28, 520 / cols - 12);
        const norm = useLog ? Math.log10(c + 1) / Math.log10(max + 1) : c / max;
        const scale = Math.max(0.04, norm);
        const rectY = 20 + fullH * (1 - scale);
        const rectH = Math.max(6, fullH * scale);
        const textY = rectY - 6;
        const textFill = scale > 0.6 ? "#ffffff" : "#222222";

        return (
          <g key={i}>
            <rect
              x={x}
              y={rectY}
              width={w}
              height={rectH}
              rx="6"
              fill="url(#gradH)"
              style={{ transition: "all 800ms cubic-bezier(.2,.9,.2,1)" }}
            />
            <text
              x={x + w / 2}
              y={textY}
              fontSize="12"
              textAnchor="middle"
              fill={textFill}
              fontWeight="700"
            >
              {c}
            </text>
            <text
              x={x + w / 2}
              y={maxHeight - 10}
              fontSize="11"
              textAnchor="middle"
              fill="#666"
            >
              {labels[i] ?? ""}
            </text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="gradH" x1="0" x2="1">
          <stop offset="0%" stopColor="#0C1CFF" />
          <stop offset="100%" stopColor="#3EFFD8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* Вспомогательные форматеры дат (русские метки) */
const weekdayShort = (d) =>
  new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(d);
const monthShort = (d) =>
  new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(d);

/* Агрегация продаж — возвращает массив {label, count} */
const aggregateSales = (sales, range) => {
  const now = new Date();

  if (range === "week") {
    // последние 7 дней (сегодня в конце)
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const label = weekdayShort(d);
      const count = sales
        .filter((s) => s.date.slice(0, 10) === key)
        .reduce((a, b) => a + b.qty, 0);
      return { label, count };
    });
  }

  if (range === "month") {
    // последние 4 недель (группируем по 7-дневным интервалам, от старого к новому)
    return Array.from({ length: 4 }).map((_, i) => {
      const end = new Date(now);
      end.setDate(now.getDate() - (3 - i) * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      const label = `${start.getDate()}.${
        start.getMonth() + 1
      }-${end.getDate()}.${end.getMonth() + 1}`;
      const count = sales
        .filter((s) => {
          const d = new Date(s.date);
          return d >= start && d <= end;
        })
        .reduce((a, b) => a + b.qty, 0);
      return { label, count };
    });
  }

  // year: последние 12 месяцев
  return Array.from({ length: 12 }).map((_, i) => {
    const m = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const label = monthShort(m);
    const count = sales
      .filter((s) => {
        const d = new Date(s.date);
        return (
          d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()
        );
      })
      .reduce((a, b) => a + b.qty, 0);
    return { label, count };
  });
};

const Stats = () => {
  const { stats, products, sales, settings } = useShop();
  const [range, setRange] = useState("week");

  const agg = useMemo(() => aggregateSales(sales, range), [sales, range]);
  const labels = agg.map((a) => a.label);
  const data = agg.map((a) => a.count);

  const topProducts = useMemo(
    () =>
      [...products].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 5),
    [products]
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Статистика продаж</h2>
        <div className="text-sm text-gray-600">{settings?.name}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Всего товаров</div>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">На складе (шт)</div>
          <div className="text-2xl font-bold">{stats.totalStock}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Продано (шт)</div>
          <div className="text-2xl font-bold">{stats.totalSalesItems}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Выручка</div>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">Гистограмма продаж</div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded ${
                range === "week" ? "btn-gradient" : "bg-gray-100"
              }`}
              onClick={() => setRange("week")}
            >
              Неделя
            </button>
            <button
              className={`px-3 py-1 rounded ${
                range === "month" ? "btn-gradient" : "bg-gray-100"
              }`}
              onClick={() => setRange("month")}
            >
              Месяц
            </button>
            <button
              className={`px-3 py-1 rounded ${
                range === "year" ? "btn-gradient" : "bg-gray-100"
              }`}
              onClick={() => setRange("year")}
            >
              Год
            </button>
          </div>
        </div>

        <Histogram data={data} labels={labels} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-2">
            Топ товаров (по цене)
          </div>
          <ul className="space-y-2">
            {topProducts.map((tp) => (
              <li key={tp.id} className="flex items-center gap-3">
                {tp.images?.[0] ? (
                  <img
                    src={tp.images[0]}
                    className="h-10 w-10 object-cover rounded"
                    alt=""
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 rounded" />
                )}
                <div>
                  <div className="text-sm font-medium">{tp.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(tp.price)} • {tp.quantity} шт
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-2">Аналитика</div>
          <div className="space-y-2 text-sm">
            <div>
              Средняя цена: <b>{formatCurrency(stats.avgPrice)}</b>
            </div>
            <div>
              Общая выручка: <b>{formatCurrency(stats.totalRevenue)}</b>
            </div>
            <div>
              Продано товаров: <b>{stats.totalSalesItems}</b>
            </div>
            <div>
              Instagram:{" "}
              <b className="text-indigo-600">{settings.instagram || "—"}</b>
            </div>
            <div>
              WhatsApp: <b>{settings.whatsapp || "—"}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
