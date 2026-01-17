'use client'
import { useState, useEffect } from 'react'
import { customerService } from '@/lib/services/customer.service'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Yeni' },
  { value: 'CONTACTED', label: 'İletişim Kuruldu' },
  { value: 'OFFER_SENT', label: 'Teklif Gönderildi' },
  { value: 'WAITING_APPROVAL', label: 'Onay Bekliyor' },
  { value: 'APPROVED', label: 'Onaylandı' },
  { value: 'WON', label: 'Kazanıldı' },
  { value: 'LOST', label: 'Kaybedildi' },
]

const CustomerEditForm = ({ customerId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    vatNumber: '',
    website: '',
    address: '',
    designation: '',
    description: '',
    status: 'NEW',
  })

  useEffect(() => {
    loadCustomer()
  }, [])

  const loadCustomer = async () => {
    const res = await customerService.getById(customerId)
    setForm(res.data)
    setLoading(false)
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async () => {
    await customerService.update(customerId, form)
    router.push(`/customers/view/${customerId}`)
  }

  if (loading) return <p>Yükleniyor...</p>

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="mb-4">Müşteri Güncelle</h5>

        <div className="row g-3">
          {/* 👤 KİŞİSEL */}
          <div className="col-md-6">
            <label className="form-label">Ad Soyad</label>
            <input className="form-control" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Ünvan / Pozisyon</label>
            <input className="form-control" value={form.designation} onChange={e => updateField('designation', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">E-posta</label>
            <input className="form-control" value={form.email || ''} onChange={e => updateField('email', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Telefon</label>
            <input className="form-control" value={form.phone || ''} onChange={e => updateField('phone', e.target.value)} />
          </div>

          {/* 🏢 FİRMA */}
          <div className="col-md-6">
            <label className="form-label">Firma Adı</label>
            <input className="form-control" value={form.companyName || ''} onChange={e => updateField('companyName', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Vergi No</label>
            <input className="form-control" value={form.vatNumber || ''} onChange={e => updateField('vatNumber', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Web Sitesi</label>
            <input className="form-control" value={form.website || ''} onChange={e => updateField('website', e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Durum</label>
            <select className="form-select" value={form.status} onChange={e => updateField('status', e.target.value)}>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* 📝 DİĞER */}
          <div className="col-12">
            <label className="form-label">Adres</label>
            <input className="form-control" value={form.address || ''} onChange={e => updateField('address', e.target.value)} />
          </div>

          <div className="col-12">
            <label className="form-label">Açıklama</label>
            <textarea className="form-control" rows="3" value={form.description || ''} onChange={e => updateField('description', e.target.value)} />
          </div>

          <div className="col-12 text-end mt-3">
            <button className="btn btn-primary" onClick={submit}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerEditForm