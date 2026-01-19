'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import Loading from '@/components/shared/Loading'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { proposalService } from '@/lib/services/proposal.service'
import { customerService } from '@/lib/services/customer.service'
import { propsalStatusOptions } from '@/utils/options'

const ProposalEditContent = ({ proposalId }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([]) 
    
    const [title, setTitle] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [content, setContent] = useState('') // 🔹 State eklendi
    const [status, setStatus] = useState('DRAFT')
    const { startDate, setStartDate, renderFooter } = useDatePicker()

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true)
                const custRes = await customerService.list()
                const custList = custRes?.data?.items || custRes?.data?.data || custRes?.data || []
                setCustomers(Array.isArray(custList) ? custList : [])

                if (proposalId) {
                    const propRes = await proposalService.getById(proposalId)
                    const data = propRes?.data
                    if (data) {
                        console.log("📥 [Yüklenen Teklif Verisi]:", data);
                        setTitle(data.title || '')
                        setCustomerId(data.customerId || '')
                        setTotalAmount(data.totalAmount !== null ? data.totalAmount.toString() : '')
                        setContent(data.content || '') // 🔹 Veritabanındaki notu yüklüyoruz
                        setStatus(data.status || 'DRAFT')
                        if (data.validUntil) {
                            setStartDate(new Date(data.validUntil))
                        }
                    }
                }
            } catch (error) {
                console.error("❌ Veri yükleme hatası:", error)
            } finally {
                setLoading(false)
            }
        }
        loadInitialData()
    }, [proposalId, setStartDate])

    const handleUpdateProposal = async () => {
        if (!title || !customerId || !startDate) {
            alert("Lütfen zorunlu alanları doldurun.");
            return;
        }

        console.log("🔘 [Güncelleme Butonuna Basıldı]");
        setLoading(true);
        try {
            const payload = {
                title: title.trim(),
                customerId: customerId, 
                validUntil: startDate.toISOString(),
                status: (status || 'DRAFT').toUpperCase(),
                totalAmount: totalAmount ? parseFloat(totalAmount) : null,
                content: content.trim() // 🔹 Güncellenmiş notu gönderiyoruz
            };

            console.log("📤 [Gönderilen Güncelleme Payload]:", payload);
            await proposalService.update(proposalId, payload);
            router.push('/proposal/list'); 
        } catch (e) {
            console.error("❌ [Güncelleme Hatası]:", e.response?.data);
            alert("Hata: " + (e.response?.data?.message || "Güncellenemedi"));
        } finally {
            setLoading(false);
        }
    }; 

    if (loading) return <Loading />

    return (
        <div className="row justify-content-center py-4 text-start">
            <div className="col-xl-6 col-lg-8 col-md-10">
                <div className="card stretch stretch-full shadow-sm">
                    <div className="card-body p-4 text-start">

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Teklif Başlığı <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </div>

                        <div className="mb-4 text-start">
                            <label className="form-label fw-semibold">Müşteri <span className="text-danger">*</span></label>
                            <select 
                                className="form-control" 
                                value={customerId} 
                                onChange={(e) => setCustomerId(e.target.value)}
                            >
                                <option value="">Müşteri Seçiniz</option>
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
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="row text-start">
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
                                    defaultSelect={status} 
                                    onSelectOption={(option) => {
                                        setStatus(option?.value?.toUpperCase() ?? 'DRAFT')
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-end gap-2 border-top pt-4">
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => router.push('/proposal/list')}>İPTAL</button>
                            <button type="button" className="btn btn-primary px-4" onClick={handleUpdateProposal}>DEĞİŞİKLİKLERİ KAYDET</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalEditContent