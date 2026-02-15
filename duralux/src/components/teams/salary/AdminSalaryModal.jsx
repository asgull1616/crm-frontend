'use client'

import { useState } from 'react'
import api from '@/lib/axios'

const months = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
]

export default function AdminSalaryModal({ employees = [], onClose, onSuccess }) {

  const currentYear = new Date().getFullYear()

  const [form, setForm] = useState({
    userId: '',
    month: '',
    year: currentYear,
    baseSalary: 0,
    missingDays: 0,
    bonus: 0,
    deduction: 0,
    advance: 0,
  })

  const daily = form.baseSalary / 30
  const missingCut = daily * form.missingDays

  const net =
    Number(form.baseSalary)
    - Number(missingCut)
    + Number(form.bonus)
    - Number(form.deduction)
    - Number(form.advance)

  const handleSubmit = async () => {
    if (!form.userId) return alert('Çalışan seçmelisiniz')
    if (!form.month) return alert('Ay seçmelisiniz')

    try {
      await api.post('/teams/payroll', {
        userId: form.userId,
        month: Number(form.month),
        year: Number(form.year),
        netSalary: net,
        note: JSON.stringify({
          baseSalary: form.baseSalary,
          missingDays: form.missingDays,
          bonus: form.bonus,
          deduction: form.deduction,
          advance: form.advance,
        }),
      })

      onSuccess()
    } catch (err) {
      alert(err?.response?.data?.message || 'Hata oluştu')
    }
  }

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card modern">

        {/* HEADER */}
        <div className="modal-header modern-header">
          <div>
            <h5>Maaş Hesapla</h5>
            <span className="modal-sub">
              Seçilen çalışan için net ödeme hesaplanır
            </span>
          </div>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="modal-body">

          {/* Çalışan */}
          <label className="field-label">Çalışan</label>
          <select
            className="form-control modern-input"
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value })}
          >
            <option value="">Çalışan Seç</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </select>

          {/* Ay & Yıl */}
          <div className="grid-2">
            <div>
              <label className="field-label">Ay</label>
              <select
                className="form-control modern-input"
                value={form.month}
                onChange={e => setForm({ ...form, month: e.target.value })}
              >
                <option value="">Ay Seç</option>
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Yıl</label>
              <select
                className="form-control modern-input"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divider" />

          {/* Maaş Alanları */}
          <div className="grid-2">

            <div>
              <label className="field-label">Baz Maaş</label>
              <input
                type="number"
                className="form-control modern-input"
                onChange={e => setForm({ ...form, baseSalary: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="field-label">Eksik Gün</label>
              <input
                type="number"
                className="form-control modern-input"
                onChange={e => setForm({ ...form, missingDays: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="field-label">Prim</label>
              <input
                type="number"
                className="form-control modern-input"
                onChange={e => setForm({ ...form, bonus: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="field-label">Kesinti</label>
              <input
                type="number"
                className="form-control modern-input"
                onChange={e => setForm({ ...form, deduction: Number(e.target.value) })}
              />
            </div>

          </div>

          {/* Net Maaş */}
          <div className="salary-preview-modern">
            <span>Net Ödenecek</span>
            <div className="preview-amount">
              {net.toLocaleString()} ₺
            </div>
          </div>

        </div>

        <div className="modal-footer modern-footer">
          <button className="btn btn-light modern-cancel" onClick={onClose}>
            İptal
          </button>
          <button className="btn modern-save" onClick={handleSubmit}>
            Kaydet
          </button>
        </div>

      </div>
    </div>
  )
}
