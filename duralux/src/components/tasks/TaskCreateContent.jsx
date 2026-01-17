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

  useEffect(() => {
    customerService.list().then(res => {
      setCustomers(res?.data?.data ?? [])
    })
  }, [])

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const onSubmit = async () => {
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
              className="form-control"
              value={form.title}
              onChange={e => onChange('title', e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Açıklama</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={e => onChange('description', e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Müşteri</label>
            <select
              className="form-control"
              value={form.customerId}
              onChange={e => onChange('customerId', e.target.value)}
            >
              <option value="">Seçiniz</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col">
              <label>Başlangıç</label>
              <input
                type="date"
                className="form-control"
                onChange={e => onChange('startDate', e.target.value)}
              />
            </div>

            <div className="col">
              <label>Bitiş</label>
              <input
                type="date"
                className="form-control"
                onChange={e => onChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <label>Durum</label>
            <select
              className="form-control"
              value={form.status}
              onChange={e => onChange('status', e.target.value)}
            >
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
