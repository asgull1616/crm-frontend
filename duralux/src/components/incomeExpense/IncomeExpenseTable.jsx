"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { transactionService } from "@/lib/services/transaction.service";

const typeBadge = (type) => (type === "INCOME" ? "success" : "danger");
const typeText = (type) => (type === "INCOME" ? "Gelir" : "Gider");

export default function IncomeExpenseTable() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // FETCH LIST
  // --------------------------------------------------
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await transactionService.list({ limit: 50 });
      setItems(res?.data?.items || []);
    } catch (err) {
      console.error(err);
      alert("Kayıtlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const item of items) {
      if (item.type === "INCOME") income += Number(item.amount);
      else expense += Number(item.amount);
    }

    return { income, expense, net: income - expense };
  }, [items]);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------
  const handleDelete = async (id) => {
    const ok = window.confirm("Kayıt silinsin mi?");
    if (!ok) return;

    try {
      await transactionService.remove(id);
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="col-12">
      {/* ÜST BUTON */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm text-white"
          style={{ backgroundColor: "#E92B63" }}
          onClick={() => router.push("/income-expense/create")}
        >
          + Yeni Kayıt
        </button>
      </div>

      {/* ÖZET */}
      <div className="row">
        {[
          { label: "Toplam Gelir", value: summary.income },
          { label: "Toplam Gider", value: summary.expense },
          { label: "Net Bakiye", value: summary.net },
        ].map((x) => (
          <div className="col-md-4 mb-3" key={x.label}>
            <div className="card">
              <div className="card-body">
                <div className="text-muted">{x.label}</div>
                <div className="h5 mb-0">
                  {Number(x.value).toLocaleString("tr-TR")} ₺
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLO */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Açıklama</th>
                <th>Tür</th>
                <th>Kategori</th>
                <th className="text-end">Tutar</th>
                <th className="text-end">Aksiyon</th>
              </tr>
            </thead>

            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>{new Date(x.date).toLocaleDateString("tr-TR")}</td>
                  <td>{x.description}</td>
                  <td>
                    <span className={`badge bg-${typeBadge(x.type)}`}>
                      {typeText(x.type)}
                    </span>
                  </td>
                  <td>{x.category}</td>
                  <td className="text-end">
                    {Number(x.amount).toLocaleString("tr-TR")} ₺
                  </td>

                  {/* ✅ AKSİYONLAR: Detay + Düzenle + Sil */}
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          router.push(`/income-expense/view/${x.id}`)
                        }
                      >
                        Detay
                      </button>

                      <button
                        className="btn btn-sm"
                        style={{
                          color: "#E92B63",
                          border: "1px solid #E92B63",
                        }}
                        onClick={() =>
                          router.push(`/income-expense/edit/${x.id}`)
                        }
                      >
                        Düzenle
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(x.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Yükleniyor...
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
