'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { taskService } from '@/lib/services/task.service'
import { customerService } from '@/lib/services/customer.service'


const TaskCreateContent = () => {
  const router = useRouter()

  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    customerId: '',
    startDate: '',
    endDate: '',
    status: 'NEW',
  })
  const [errors, setErrors] = useState({})


  useEffect(() => {
    customerService.list().then(res => {
      setCustomers(res?.data?.data ?? [])
    })
  }, [])

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
  const newErrors = {}

  if (!form.title.trim()) {
    newErrors.title = 'Başlık zorunludur.'
  }

  if (!form.description.trim()) {
    newErrors.description = 'Açıklama zorunludur.'
  }

  if (!form.customerId) {
    newErrors.customerId = 'Müşteri seçilmelidir.'
  }

  if (!form.startDate) {
    newErrors.startDate = 'Başlangıç tarihi zorunludur.'
  }

  if (!form.endDate) {
    newErrors.endDate = 'Bitiş tarihi zorunludur.'
  }

  if (!form.status) {
    newErrors.status = 'Durum seçilmelidir.'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

  const onSubmit = async () => {
  if (!validateForm()) return

  try {
      const cleaned = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )

      await taskService.create(cleaned)
      router.push('/projects/list')
    } catch (e) {
      console.error(e)
      alert('Görev oluşturulamadı')
    }
  }

  return (
    <div className="col-lg-8">
      <div className="card">
        <div className="card-header">
          <h5>Yeni Görev</h5>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label>Başlık *</label>
            <input
  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
  value={form.title}
  onChange={e => {
    onChange('title', e.target.value)
    setErrors({ ...errors, title: null })
  }}
/>
{errors.title && <div className="text-danger mt-1">{errors.title}</div>}

          </div>

          <div className="mb-3">
            <label>Açıklama</label>
            <textarea
  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
  rows={4}
  value={form.description}
  onChange={e => {
    onChange('description', e.target.value)
    setErrors({ ...errors, description: null })
  }}
/>
{errors.description && (
  <div className="text-danger mt-1">{errors.description}</div>
)}

          </div>

          <div className="mb-3">
  <label>
    Müşteri <span className="text-danger">*</span>
  </label>

  <select
    className={`form-control ${errors.customerId ? 'is-invalid' : ''}`}
    value={form.customerId}
    onChange={e => {
      onChange('customerId', e.target.value)
      setErrors({ ...errors, customerId: null })
    }}
  >
    <option value="">Seçiniz</option>
    {customers.map(c => (
      <option key={c.id} value={c.id}>
        {c.fullName}
      </option>
    ))}
  </select>

  {errors.customerId && (
    <div className="text-danger mt-1">
      {errors.customerId}
    </div>
  )}
</div>


          <div className="row">
            <div className="col">
              <label>Başlangıç</label>
              <input
  type="date"
  className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
  value={form.startDate}
  onChange={e => {
    onChange('startDate', e.target.value)
    setErrors({ ...errors, startDate: null })
  }}
/>

{errors.startDate && (
  <div className="text-danger mt-1">{errors.startDate}</div>
)}

            </div>

            <div className="col">
  <label>
    Bitiş <span className="text-danger">*</span>
  </label>

  <input
    type="date"
    className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
    value={form.endDate}
    onChange={e => {
      onChange('endDate', e.target.value)
      setErrors({ ...errors, endDate: null })
    }}
  />

  {errors.endDate && (
    <div className="text-danger mt-1">
      {errors.endDate}
    </div>
  )}
</div>

          </div>

          <div className="mt-3">
            <label>Durum</label>
            <select
  className={`form-control ${errors.status ? 'is-invalid' : ''}`}
  value={form.status}
  onChange={e => {
    onChange('status', e.target.value)
    setErrors({ ...errors, status: null })
  }}
>
{errors.status && (
  <div className="text-danger mt-1">{errors.status}</div>
)}


              <option value="NEW">Yeni</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="ON_HOLD">Beklemede</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
          </div>

          <div className="mt-4 text-end">
            <button className="btn btn-primary" onClick={onSubmit}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCreateContent
