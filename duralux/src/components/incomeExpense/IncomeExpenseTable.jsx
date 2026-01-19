'use client'
import React, { useMemo, useState } from 'react'

const initialItems = [
  { id: '1', date: '2026-01-10', type: 'INCOME', category: 'Satış', description: 'Web sitesi ödeme', amount: 12500 },
  { id: '2', date: '2026-01-12', type: 'EXPENSE', category: 'Kira', description: 'Ofis kirası', amount: 4500 },
  { id: '3', date: '2026-01-15', type: 'EXPENSE', category: 'Araç', description: 'Yakıt', amount: 1200 },
]

const typeBadge = (type) => (type === 'INCOME' ? 'success' : 'danger')
const typeText = (type) => (type === 'INCOME' ? 'Gelir' : 'Gider')

export default function IncomeExpenseTable() {
  const [items, setItems] = useState(initialItems)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'INCOME',
    category: '',
    description: '',
    amount: '',
  })

  const summary = useMemo(() => {
    const income = items.filter((i) => i.type === 'INCOME').reduce((a, b) => a + b.amount, 0)
    const expense = items.filter((i) => i.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0)
    return { income, expense, net: income - expense }
  }, [items])

  const openCreateModal = () => {
    setEditId(null)
    setForm({
      date: new Date().toISOString().slice(0, 10),
      type: 'INCOME',
      category: '',
      description: '',
      amount: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditId(item.id)
    setForm({
      date: item.date,
      type: item.type,
      category: item.category,
      description: item.description,
      amount: String(item.amount),
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditId(null)
  }

  const handleSave = () => {
    if (!form.date) return alert('Tarih zorunlu')
    if (!form.category.trim()) return alert('Kategori zorunlu')
    if (!form.description.trim()) return alert('Açıklama zorunlu')
    if (form.amount === '' || Number(form.amount) <= 0) return alert('Tutar 0’dan büyük olmalı')

    const payload = {
      date: form.date,
      type: form.type,
      category: form.category.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
    }

    if (editId) {
      setItems((prev) => prev.map((x) => (x.id === editId ? { ...x, ...payload } : x)))
      closeModal()
      return
    }

    const newItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...payload,
    }

    setItems((prev) => [newItem, ...prev])
    closeModal()
  }

  const handleDelete = (id) => {
    if (!confirm('Kayıt silinsin mi?')) return
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="col-12">
      {/* Sağ üst buton */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-sm text-white" 
          style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }}
          onClick={openCreateModal}
        >
          + Yeni Kayıt
        </button>
      </div>

      {/* Özet kartlar */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Toplam Gelir</div>
              <div className="h5 mb-0">{summary.income.toLocaleString()} ₺</div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Toplam Gider</div>
              <div className="h5 mb-0">{summary.expense.toLocaleString()} ₺</div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="text-muted">Net Bakiye</div>
              <div className="h5 mb-0">{summary.net.toLocaleString()} ₺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablo */}
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
                  <td>{new Date(x.date).toLocaleDateString()}</td>
                  <td>{x.description}</td>
                  <td>
                    <span className={`badge bg-${typeBadge(x.type)}`}>{typeText(x.type)}</span>
                  </td>
                  <td>{x.category}</td>
                  <td className="text-end">{x.amount.toLocaleString()} ₺</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        className="btn btn-sm"
                        style={{ color: '#E92B63', border: '1px solid #E92B63' }}
                        onClick={() => openEditModal(x)}
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
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODAL */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="card"
            style={{ width: 'min(520px, 92vw)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="fw-semibold">{editId ? 'Kaydı Düzenle' : 'Yeni Kayıt'}</div>
              <button className="btn btn-sm btn-outline-secondary" onClick={closeModal}>
                Kapat
              </button>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tür</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="INCOME">Gelir</option>
                    <option value="EXPENSE">Gider</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tarih</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Açıklama</label>
                  <input
                    className="form-control"
                    placeholder="Örn: Web sitesi ödeme"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="col-md-7">
                  <label className="form-label">Kategori</label>
                  <input
                    className="form-control"
                    placeholder="Örn: Satış / Kira / Araç"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label">Tutar (₺)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="card-footer d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary" onClick={closeModal}>
                İptal
              </button>
              <button 
                className="btn text-white" 
                style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }}
                onClick={handleSave}
              >
                {editId ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}