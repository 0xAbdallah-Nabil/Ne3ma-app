import { useEffect, useState } from "react";
import defaultProducts from "./products.json";

type Product = { id: number; name: string; price: number; barcode: string | null };

const STORAGE_KEY = "products-v2";
const COUNT = defaultProducts.length;

// لو فيه أسعار متعدلة ومحفوظة بنستخدمها، وإلا بنستخدم products.json
const loadProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length === COUNT) return parsed;
    }
  } catch {
    /* ignore */
  }
  return defaultProducts as Product[];
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function App() {
  const [ products, setProducts ] = useState<Product[]>(loadProducts);
  const [ qty, setQty ] = useState<string[]>(Array(COUNT).fill(""));
  const [ editing, setEditing ] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      /* ignore */
    }
  }, [ products ]);

  const update = (i: number, patch: Partial<Product>) =>
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const resetPrices = () => {
    if (confirm("ترجّع الأسعار والأسماء للقيم الأصلية؟")) {
      setProducts(defaultProducts as Product[]);
    }
  };

  const totals = products.map((p, i) => p.price * (parseFloat(qty[ i ]) || 0));
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const uniqueProducts = qty.filter((q) => (parseFloat(q) || 0) > 0).length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-xl p-4 pb-32">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-500">حاسبة منتجات اللبان نعمة</h1>
          <button
            onClick={() => setEditing((e) => !e)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${editing ? "bg-emerald-600 text-white" : "bg-white shadow-sm"
              }`}
          >
            {editing ? "حفظ الأسعار" : "تعديل الأسعار"}
          </button>
        </header>

        <ul className="space-y-2">
          {products.map((p, i) => {
            const selected = (parseFloat(qty[ i ]) || 0) > 0;
            return (
              <li
                key={p.id}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl p-3 shadow-sm transition-colors ${selected ? "bg-emerald-100 ring-1 ring-emerald-400" : "bg-white"
                  }`}
              >
                <div className="min-w-0">
                  {editing ? (
                    <input
                      value={p.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                    />
                  ) : (
                    <div className="font-medium">{p.name}</div>
                  )}
                  {editing ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={p.price || ""}
                      placeholder="السعر"
                      onChange={(e) =>
                        update(i, { price: Math.max(0, parseFloat(e.target.value) || 0) })
                      }
                      className="mt-1 w-28 rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                    />
                  ) : (
                    <div className="text-sm text-slate-500">السعر: {fmt(p.price)}</div>
                  )}
                </div>

                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={qty[ i ]}
                  placeholder="العدد"
                  onChange={(e) =>
                    setQty((prev) => prev.map((q, idx) => (idx === i ? e.target.value : q)))
                  }
                  className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-2 text-center text-lg"
                />

                <div className="w-24 text-left font-semibold tabular-nums">{fmt(totals[ i ])}</div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex gap-2 ">
          <button
            onClick={() => setQty(Array(COUNT).fill(""))}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm text-black shadow-sm"
          >
            مسح الأعداد
          </button>
          {editing && (
            <button
              onClick={resetPrices}
              className="flex-1 rounded-lg bg-white py-2 text-sm text-red-600 shadow-sm"
            >
              رجوع للأسعار الأصلية
            </button>
          )}
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 bg-slate-900 p-4 text-white">
        <div className="mx-auto max-w-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-lg">عدد الاصناف</span>
            <span className="text-2xl font-bold tabular-nums">{fmt(uniqueProducts)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg">الإجمالي</span>
            <span className="text-2xl font-bold tabular-nums">{fmt(grandTotal)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}