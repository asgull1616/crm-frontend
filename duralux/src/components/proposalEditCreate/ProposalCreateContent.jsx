'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SelectDropdown from '@/components/shared/SelectDropdown'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import Loading from '@/components/shared/Loading'
import { proposalService } from '@/lib/services/proposal.service'
import { customerService } from '@/lib/services/customer.service'
import { propsalStatusOptions } from '@/utils/options'

const ProposalCreateContent = () => {
    const [customers, setCustomers] = useState([])
    const [totalAmount, setTotalAmount] = useState('')
    const [title, setTitle] = useState('')
    const [customerId, setCustomerId] = useState(null)
    const [content, setContent] = useState('') // 🔹 Mevcut yapıya uygun state
    const [status, setStatus] = useState('DRAFT')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { startDate, setStartDate, renderFooter } = useDatePicker()

    useEffect(() => {
        customerService.list().then((res) => {
            const list = res?.data?.items || res?.data?.data || res?.data || []
            setCustomers(list)
        })
    }, [])

    const handleCreateProposal = async (send = false) => {
        if (!title || !customerId || !startDate) return
        setLoading(true)
        try {
            const payload = {
                title,
                customerId,
                validUntil: startDate.toISOString(),
                status: send ? 'SENT' : status.toUpperCase(),
                totalAmount: totalAmount ? totalAmount.toString() : null,
                content: content.trim() // 🔹 Backend'e gönderilen alan
            };
            
            console.log("📤 [Create Proposal Payload]:", payload);
            await proposalService.create(payload);
            router.push('/proposal/list');
        } catch (e) {
            console.error('BACKEND ERROR:', e.response?.data);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="row justify-content-center py-4 text-start">
            <div className="col-xl-6 col-lg-8 col-md-10"> 
                {loading && <Loading />}

                <div className="card stretch stretch-full shadow-sm">
                    <div className="card-body p-4">

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Teklif Başlığı <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Konu"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Müşteri <span className="text-danger">*</span></label>
                            <select
                                className="form-control"
                                value={customerId || ''}
                                onChange={(e) => setCustomerId(e.target.value)}
                            >
                                <option value="">Seçiniz</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.fullName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Miktar</label>
                            <input
                                type="number"
                                className="form-control no-spinner"
                                placeholder="Örn: 1500"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                            />
                        </div>

                        {/* 🔹 Tanım / Not Giriş Alanı */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Teklif Tanımı / Not</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="Teklif detaylarını buraya yazabilirsiniz..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 mb-4">
                                <label className="form-label fw-semibold">Geçerlilik Tarihi <span className="text-danger">*</span></label>
                                <div className="input-group date">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        className="form-control"
                                        calendarContainer={({ children }) => (
                                            <div className="bg-white react-datepicker">
                                                {children}{renderFooter('start')}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <label className="form-label fw-semibold">Durum</label>
                                <SelectDropdown
                                    options={propsalStatusOptions}
                                    defaultSelect="Durum Seçin"
                                    onSelectOption={(option) => {
                                        setStatus(option?.value?.toUpperCase() ?? 'DRAFT')
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-4 d-flex gap-2 justify-content-end">
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => handleCreateProposal(false)} disabled={loading}>KAYDET</button>
                            <button type="button" className="btn btn-primary px-4" onClick={() => handleCreateProposal(true)} disabled={loading}>KAYDET & GÖNDER</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalCreateContent