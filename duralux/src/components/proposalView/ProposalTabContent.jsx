'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FiEdit, FiHash, FiCalendar, FiDollarSign, FiType } from 'react-icons/fi'
import JoditEditor from 'jodit-react'
import useJoditConfig from '@/hooks/useJoditConfig'
import { proposalService } from '@/lib/services/proposal.service'

/* 🔹 Tablo ile Birebir Aynı Durum Eşleştirici */
const mapStatus = (status) => {
    switch (status) {
        case 'DRAFT':
            return { content: 'Taslak', color: 'bg-warning' }
        case 'SENT':
            // Tablodaki "Gönderildi" yazısı ve yeşil/mavi arası renk (bg-info genelde bu tonu verir)
            return { content: 'Gönderildi', color: 'bg-info' } 
        case 'APPROVED':
            return { content: 'Onaylandı', color: 'bg-success' }
        case 'REJECTED':
            return { content: 'Reddedildi', color: 'bg-danger' }
        default:
            return { content: status, color: 'bg-secondary' }
    }
}

const ProposalTabContent = () => {
    const pathname = usePathname()
    const [value, setValue] = useState('')
    const [proposal, setProposal] = useState(null)
    const [loading, setLoading] = useState(true)
    const config = useJoditConfig()

    const getProposalIdFromPath = () => {
        const segments = pathname.split('/')
        return segments[segments.length - 1]
    }

    const fetchProposal = async () => {
        const proposalId = getProposalIdFromPath()
        if (!proposalId || proposalId === 'view') {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const res = await proposalService.getById(proposalId)
            if (res?.data) {
                setProposal(res.data)
                setValue(res.data.content || "")
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (pathname) fetchProposal()
    }, [pathname])

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>
    if (!proposal) return <div className="alert alert-warning m-4">Veri bulunamadı.</div>

    // 🔹 Mevcut durumu tabloda kullandığın mantıkla eşleştiriyoruz
    const statusInfo = mapStatus(proposal.status)

    return (
        <div className="tab-pane fade active show" id="proposalTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <div className="row g-4 align-items-center">
                                
                                {/* Teklif Başlığı */}
                                <div className="col-md-4 border-end-md">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-text bg-soft-primary text-primary rounded">
                                            <FiType size={20} />
                                        </div>
                                        <div>
                                            <span className="fs-11 text-muted d-block text-uppercase fw-extrabold">Teklif Başlığı</span>
                                            <span className="fs-14 fw-bold text-dark d-block text-truncate">{proposal.title}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tutar */}
                                <div className="col-md-3 border-end-md">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-text bg-soft-success text-success rounded">
                                            <FiDollarSign size={20} />
                                        </div>
                                        <div>
                                            <span className="fs-11 text-muted d-block text-uppercase fw-extrabold">Tutar</span>
                                            <span className="fs-14 fw-bold text-dark">
                                                {proposal.totalAmount} {proposal.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarih */}
                                <div className="col-md-3 border-end-md">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-text bg-soft-warning text-warning rounded">
                                            <FiCalendar size={20} />
                                        </div>
                                        <div>
                                            <span className="fs-11 text-muted d-block text-uppercase fw-extrabold">Oluşturulma</span>
                                            <span className="fs-14 fw-bold text-dark">
                                                {new Date(proposal.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 🔹 Tablodakiyle Aynı Durum Badge'i */}
                                <div className="col-md-2 text-md-end">
                                    <span className="fs-11 text-muted d-block text-uppercase fw-extrabold mb-1">Durum</span>
                                    <span className={`badge ${statusInfo.color} text-white`}>
                                        {statusInfo.content}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Teklif Detayı</h5>
                            <button className="btn btn-sm btn-light-brand">Kaydet</button>
                        </div>
                        <div className="card-body p-0">
                            <JoditEditor value={value} config={config} onBlur={c => setValue(c)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalTabContent