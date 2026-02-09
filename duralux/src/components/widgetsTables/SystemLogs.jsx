'use client'
import React, { useState } from 'react'
import CardHeader from '@/components/shared/CardHeader'
import useCardTitleActions from '@/hooks/useCardTitleActions'

const logsData = [
    { id: 1, user: 'Ahmet Yılmaz', action: 'Sisteme Giriş Yaptı', type: 'login', time: '2 dakika önce', ip: '192.168.1.1' },
    { id: 2, user: 'Mehmet Demir', action: 'Teklif Durumunu Güncelledi', type: 'update', time: '15 dakika önce', ip: '192.168.1.45' },
    { id: 3, user: 'Selin Ak', action: 'Yeni Müşteri Eklendi: ABC A.Ş.', type: 'create', time: '1 saat önce', ip: '176.234.12.5' },
    { id: 4, user: 'Admin', action: 'Kritik Ayarlar Değiştirildi', type: 'warning', time: '3 saat önce', ip: '85.105.44.12' },
    { id: 5, user: 'Caner Öz', action: 'Bir Dosya Sildi', type: 'delete', time: '5 saat önce', ip: '192.168.1.22' },
]

const getBadge = (type) => {
    switch (type) {
        case 'login': return <span className="badge bg-soft-info text-info">Giriş</span>
        case 'update': return <span className="badge bg-soft-primary text-primary">Güncelleme</span>
        case 'create': return <span className="badge bg-soft-success text-success">Oluşturma</span>
        case 'warning': return <span className="badge bg-soft-warning text-warning">Kritik</span>
        case 'delete': return <span className="badge bg-soft-danger text-danger">Silme</span>
        default: return <span className="badge bg-soft-secondary text-secondary">İşlem</span>
    }
}

const SystemLogs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) return null;

    // Arama terimine göre hem kullanıcı adı hem de işlemi filtreliyoruz
    const filteredLogs = logsData.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="col-xxl-12 mt-4">
            <div className={`card stretch stretch-full border-0 shadow-sm ${isExpanded ? "card-expand" : ""}`}>
                <div className="d-flex justify-content-between align-items-center pe-4">
                    <CardHeader title="Sistem Aktivite Logları" refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
                    
                    {/* Modern Search Bar */}
                    <div className="search-box" style={{ width: '250px' }}>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light border-0"><i className="fi fi-rr-search text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0" 
                                placeholder="Kullanıcı veya işlem ara..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body p-0 mt-2">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Kullanıcı</th>
                                    <th>İşlem Detayı</th>
                                    <th>Tip</th>
                                    <th>IP Adresi</th>
                                    <th className="text-end pe-4">Zaman</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-xs bg-light-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold">
                                                        {log.user.charAt(0)}
                                                    </div>
                                                    <span className="fw-semibold text-dark">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{log.action}</td>
                                            <td>{getBadge(log.type)}</td>
                                            <td className="text-muted fs-12">{log.ip}</td>
                                            <td className="text-end pe-4 text-muted fs-12">{log.time}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Sonuç bulunamadı...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-transparent border-top-dashed text-center">
                    <span className="text-muted fs-12">Toplam {filteredLogs.length} kayıt listeleniyor</span>
                </div>
            </div>
        </div>
    )
}

export default SystemLogs 