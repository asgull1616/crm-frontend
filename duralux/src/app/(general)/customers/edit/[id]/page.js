'use client'
import React, { useState, useRef, useEffect } from 'react'
import { 
  FiUser, FiMail, FiBriefcase, FiMapPin, FiSave, 
  FiSearch, FiChevronDown, FiGlobe, FiHash, FiPieChart, FiCheckCircle, FiActivity, FiClock, FiPlusCircle, FiEdit3, FiRefreshCw, FiList
} from 'react-icons/fi'

const EditCustomer = () => {
    const dropdownRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState({ code: '+90', flag: 'TR', name: 'TURKEY' });
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Güncelleme sayfası olduğu için veriler başlangıçta dolu simüle ediliyor
    const [formData, setFormData] = useState({
        fullName: 'Zeynep Daş',
        email: 'zeynep@codyol.com',
        phone: '+90 532 000 00 00',
        company: 'Codyol Digital',
        title: 'Senior Developer',
        taxNumber: '1234567890',
        website: 'www.codyol.com',
        address: 'Yalova, Türkiye'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const progress = 90; // Veri doluluk oranı

    const handleUpdate = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Müşteri başarıyla güncellendi!");
        }, 1500);
    };

    return (
        <div className="main-content" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px' }}>
            
            {/* ÜST BİLGİ VE AKSİYON BAR */}
            <div className="d-flex justify-content-between align-items-center mb-5 bg-white p-4 shadow-sm rounded-4">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', color: '#D95F80' }}>
                        <FiUser size={30} />
                    </div>
                    <div>
                        <h4 className="fw-bold mb-0 text-dark">{formData.fullName}</h4>
                        <span className="text-muted small"><FiEdit3 /> Müşteri Bilgilerini Düzenliyorsunuz</span>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn rounded-pill px-4 fw-bold text-muted border py-2 bg-white shadow-none" style={{ fontSize: '13px' }}>İPTAL</button>
                    <button 
                        className="btn rounded-pill px-4 py-2 fw-bold text-white shadow-sm d-flex align-items-center gap-2" 
                        style={{ backgroundColor: '#D95F80', border: 'none', fontSize: '13px' }}
                        onClick={handleUpdate}
                    >
                        <FiRefreshCw className={loading ? 'spin' : ''} /> {loading ? 'GÜNCELLENİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                    </button>
                </div>
            </div>

            <div className="row g-4 align-items-start">
                {/* SOL KOLON: GÜNCELLEME FORMU */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '30px', padding: '40px', background: '#ffffff' }}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">İsim Soyisim</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiUser /></div>
                                    <input type="text" name="fullName" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.fullName} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Email</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiMail /></div>
                                    <input type="email" name="email" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.email} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Telefon</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiActivity /></div>
                                    <input type="text" name="phone" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.phone} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Şirket</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiBriefcase /></div>
                                    <input type="text" name="company" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.company} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Unvan</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiEdit3 /></div>
                                    <input type="text" name="title" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.title} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Website</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiGlobe /></div>
                                    <input type="text" name="website" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.website} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Vergi Numarası</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input">
                                    <div className="ms-2 bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{width:'38px', height:'38px'}}><FiHash /></div>
                                    <input type="text" name="taxNumber" className="form-control border-0 py-3 bg-transparent shadow-none" value={formData.taxNumber} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small text-muted fw-bold mb-2 ms-2">Adres Bilgisi</label>
                                <div className="bg-light border-0 rounded-4 p-3 position-relative">
                                    <textarea name="address" className="form-control border-0 bg-transparent p-0 shadow-none small" rows="3" value={formData.address} onChange={handleInputChange} style={{resize: 'none'}}></textarea>
                                    <FiMapPin className="position-absolute bottom-0 end-0 m-3 text-muted opacity-25" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON: ANALİZ VE GEÇMİŞ */}
                <div className="col-lg-4 d-flex flex-column gap-4">
                    {/* VERİ SAĞLIĞI PANELİ */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '30px', padding: '30px', background: '#ffffff' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#D95F80', fontSize: '13px' }}>
                            <FiPieChart /> Veri Sağlığı
                        </h6>
                        <div className="text-center">
                            <div className="position-relative d-inline-flex align-items-center justify-content-center">
                                <svg width="100" height="100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#9FB8A0" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * 90) / 100} strokeLinecap="round" />
                                </svg>
                                <span className="position-absolute fw-bold" style={{fontSize: '18px'}}>%90</span>
                            </div>
                        </div>
                        <p className="text-muted text-center small mt-3 mb-0">Müşteri profili şu an yüksek oranda güncel.</p>
                    </div>

                    {/* AKTİVİTE LOGU (GÜNCELLEME GEÇMİŞİ) */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '30px', padding: '30px', background: '#ffffff' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '13px' }}>
                            <FiList style={{ color: '#D95F80' }} /> Son İşlemler
                        </h6>
                        <div className="vstack gap-3">
                            <div className="d-flex gap-3 align-items-start border-bottom pb-2">
                                <div className="p-2 rounded bg-light text-muted"><FiClock size={12} /></div>
                                <div>
                                    <p className="mb-0 small fw-bold">Profil Güncellendi</p>
                                    <span className="text-muted" style={{fontSize: '10px'}}>2 saat önce - Admin</span>
                                </div>
                            </div>
                            <div className="d-flex gap-3 align-items-start border-bottom pb-2">
                                <div className="p-2 rounded bg-light text-success"><FiCheckCircle size={12} /></div>
                                <div>
                                    <p className="mb-0 small fw-bold">E-posta Doğrulandı</p>
                                    <span className="text-muted" style={{fontSize: '10px'}}>Dün - Otomatik</span>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-link text-decoration-none small p-0 mt-3" style={{fontSize: '11px', color: '#9FB8A0'}}>Tüm Geçmişi Gör</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-input { transition: all 0.3s; border: 1px solid transparent !important; }
                .custom-input:focus-within { border-color: #D95F80 !important; background-color: #fff !important; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}

export default EditCustomer;