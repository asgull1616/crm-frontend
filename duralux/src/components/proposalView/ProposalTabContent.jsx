'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FiSave, FiType, FiDollarSign, FiFileText } from 'react-icons/fi'
import JoditEditor from 'jodit-react'
import useJoditConfig from '@/hooks/useJoditConfig'
import { proposalService } from '@/lib/services/proposal.service'
import Loading from '@/components/shared/Loading'

const ProposalTabContent = () => {
    const pathname = usePathname()
    const [value, setValue] = useState('')
    const [proposal, setProposal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const config = useJoditConfig()

    const getProposalIdFromPath = () => {
        const segments = pathname.split('/')
        return segments[segments.length - 1]
    }

    const fetchProposal = async () => {
        const proposalId = getProposalIdFromPath()
        try {
            setLoading(true)
            const res = await proposalService.getById(proposalId)
            if (res?.data) {
                setProposal(res.data)
                // Ahmetburak yazan veya mevcut içerik buraya yüklenecek
                setValue(res.data.content || "")
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateContent = async () => {
        const proposalId = getProposalIdFromPath()
        try {
            setSaving(true)
            // Editördeki yeni değeri servise gönderiyoruz
            await proposalService.update(proposalId, { content: value })
            alert("Tanım başarıyla güncellendi.")
            fetchProposal()
        } catch (error) {
            alert("Güncelleme sırasında hata oluştu.")
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        if (pathname) fetchProposal()
    }, [pathname])

    if (loading) return <Loading />
    if (!proposal) return <div className="p-4">Teklif verisi yüklenemedi.</div>

    return (
        <div className="container-fluid p-0">
            <div className="row">
                {/* ÜST ÖZET KART */}
                <div className="col-lg-12 mb-4">
                    <div className="card stretch stretch-full shadow-sm">
                        <div className="card-body">
                            <div className="row g-4 align-items-center">
                                <div className="col-md-4 border-end-md">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-text bg-soft-primary text-primary rounded"><FiType size={20} /></div>
                                        <div>
                                            <span className="fs-11 text-muted d-block text-uppercase fw-extrabold">Teklif Başlığı</span>
                                            <span className="fs-14 fw-bold text-dark">{proposal.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-text bg-soft-success text-success rounded"><FiDollarSign size={20} /></div>
                                        <div>
                                            <span className="fs-11 text-muted d-block text-uppercase fw-extrabold">Tutar</span>
                                            <span className="fs-14 fw-bold text-dark">{proposal.totalAmount} {proposal.currency || 'TRY'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ANA DÜZENLEME ALANI */}
                <div className="col-lg-12">
                    <div className="card stretch stretch-full shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom py-3">
                            <div className="d-flex align-items-center gap-2">
                                <FiFileText className="text-primary" />
                                <h5 className="card-title mb-0 fw-bold">Teklif Tanımını Düzenle</h5>
                            </div>
                            
                            <button 
                                type="button" 
                                className="btn btn-primary d-flex align-items-center gap-2"
                                onClick={handleUpdateContent}
                                disabled={saving}
                            >
                                <FiSave size={16} /> 
                                {saving ? 'Güncelleniyor...' : 'GÜNCELLE'}
                            </button>
                        </div>
                        <div className="card-body p-0">
                            {/* Artık bekleme veya sekme değiştirme yok, editör direkt aktif */}
                            <JoditEditor 
                                value={value} 
                                config={config} 
                                onBlur={c => setValue(c)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalTabContent