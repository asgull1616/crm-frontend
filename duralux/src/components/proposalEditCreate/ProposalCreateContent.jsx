'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'

import Loading from '@/components/shared/Loading'
import AddProposal from './AddProposal'

import useDatePicker from '@/hooks/useDatePicker'
import { proposalService } from '@/lib/services/proposal.service'
import { customerService } from '@/lib/services/customer.service'

const previtems = [
  {
    id: 1,
    product: '',
    qty: 0,
    price: 0,
  },
]

const ProposalCreateContent = () => {
  const router = useRouter()
  const { startDate, setStartDate, renderFooter } = useDatePicker()

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [status] = useState('DRAFT')

  useEffect(() => {
    customerService
      .list()
      .then((res) => {
        const raw =
          res?.data?.items ||
          res?.data?.data ||
          res?.data ||
          []

        setCustomers(Array.isArray(raw) ? raw : [])
      })
      .catch(() => {
        setCustomers([])
      })
  }, [])

  const handleCreateProposal = async (send = false) => {
    if (!title || !customerId || !startDate) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    setLoading(true)
    try {
      await proposalService.create({
        title,
        customerId,
        validUntil: startDate.toISOString(),
        status: send ? 'SENT' : status,
      })

      router.push('/proposal/list')
    } catch (e) {
      console.error('BACKEND ERROR:', e?.response?.data || e)
      alert('Teklif oluşturulamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loading />}

      <div className="col-xl-6">
        <div className="card stretch stretch-full">
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label">
                Teklif Başlığı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Konu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Müşteri <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4">
                <label className="form-label">
                  Geçerlilik Tarihi <span className="text-danger">*</span>
                </label>
                <DatePicker
                  placeholderText="Geçerlilik Tarihi Seçin"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  popperPlacement="bottom-start"
                  calendarContainer={({ children }) => (
                    <div className="bg-white react-datepicker">
                      {children}
                      {renderFooter('start')}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddProposal previtems={previtems} />

      <div className="mt-4 d-flex justify-content-end gap-2">
        <button
          className="btn btn-primary btn-primary-action"
          onClick={() => handleCreateProposal(true)}
          disabled={loading}
        >
          KAYDET
        </button>
      </div>
    </>
  )
}

export default ProposalCreateContent
