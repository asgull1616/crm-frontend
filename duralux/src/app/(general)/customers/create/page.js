'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FiUser, FiMail, FiBriefcase, FiMapPin, FiSave, 
  FiSearch, FiChevronDown, FiGlobe, FiHash, FiPieChart, FiCheckCircle, FiActivity, FiClock, FiPlusCircle
} from 'react-icons/fi'

const CreateCustomer = () => {
    const router = useRouter();
    const dropdownRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState({ code: '+90', flag: 'TR', name: 'TURKEY' });
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '+90',
        company: '',
        title: '',
        taxNumber: '',
        website: '',
        address: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateProgress = () => {
        const fields = Object.values(formData);
        const filledFields = fields.filter(value => 
            value.trim() !== '' && value !== '+90'
        ).length;
        return Math.round((filledFields / fields.length) * 100);
    };

    const progress = calculateProgress();

    const handleSubmit = async () => {
    // Boş alan kontrolü
    if (!formData.fullName || !formData.email) {
        alert("Lütfen temel bilgileri doldurun.");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch('https://localhost:7000/api/customers', { // Kendi portunu yaz!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Müşteri başarıyla oluşturuldu!");
            // Detay ekranına yönlendir (Dönen ID'yi kullanır)
            router.push(`/customers/${data.id}`); 
        } else {
            alert("Hata: " + (data.message || "Kaydedilemedi"));
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
        alert("Sunucuya bağlanılamadı. Backend projesinin çalıştığından emin olun.");
    } finally {
        setLoading(false);
    }
};

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setFormData(prev => ({ ...prev, phone: country.code }));
        setIsCountryOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsCountryOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="main-content" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px' }}>
            
            {/* Üst Navigasyon */}
            <div className="d-flex align-items-center gap-3 mb-5 ps-2">
                <span className="fw-bold border-bottom border-3 pb-2" style={{ color: '#D95F80', borderColor: '#D95F80', fontSize: '13px' }}>Müşteriler</span>
                <span className="text-muted small pb-2">Ana Sayfa</span>
                <span className="small fw-bold pb-2" style={{ color: '#9FB8A0' }}>Yeni Kayıt Oluştur</span>
            </div>

            <div className="row g-4 align-items-start">
                {/* SOL KOLON: FORM ALANI */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '40px', padding: '50px', background: '#ffffff' }}>
                        <div className="text-center mb-5">
                            <div className="d-inline-flex align-items-center gap-2 px-5 py-2 rounded-pill" style={{ backgroundColor: '#FFF5F7', border: '1px solid #FFE4E9' }}>
                                <FiUser style={{ color: '#D95F80' }} size={16} />
                                <span className="fw-bold small" style={{ fontSize: '12px', color: '#D95F80', letterSpacing: '0.8px' }}>MÜŞTERİ PROFİLİ</span>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">İsim Soyisim</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiUser size={18} /></div>
                                    <input type="text" name="fullName" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="Ad Soyad" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Email</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiMail size={18} /></div>
                                    <input type="email" name="email" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="ornek@mail.com" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6 position-relative" ref={dropdownRef}>
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Telefon</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper-phone">
                                    <button className="btn border-0 d-flex align-items-center gap-2 px-3 h-100 ms-1" type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} style={{ backgroundColor: '#EEF2F6', borderRadius: '50px', height: '42px', minWidth: '85px' }}>
                                        <span className="fw-bold small" style={{ color: '#64748B' }}>{selectedCountry.flag}</span>
                                        <FiChevronDown size={14} style={{ color: '#64748B' }} />
                                    </button>
                                    <input type="text" name="phone" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" value={formData.phone} style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Şirket</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiBriefcase size={18} /></div>
                                    <input type="text" name="company" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="Şirket Adı" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Unvan</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiActivity size={18} /></div>
                                    <input type="text" name="title" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="Pozisyon" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Website</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiGlobe size={18} /></div>
                                    <input type="text" name="website" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="www.codyol.com" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Vergi Numarası</label>
                                <div className="d-flex align-items-center bg-light border-0 rounded-pill overflow-hidden custom-input-wrapper">
                                    <div className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle ms-2" style={{ width: '42px', height: '42px', color: '#6B7280' }}><FiHash size={18} /></div>
                                    <input type="text" name="taxNumber" className="form-control border-0 py-3 ps-3 bg-transparent shadow-none" placeholder="1234567890" style={{ fontSize: '14px' }} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small text-muted fw-medium mb-2 ms-2">Adres Bilgisi</label>
                                <div className="bg-light border-0 rounded-4 p-4 position-relative" style={{ minHeight: '130px' }}>
                                    <textarea name="address" className="form-control border-0 bg-transparent p-0 shadow-none small w-100" rows="3" placeholder="Açık adres..." style={{ resize: 'none', fontSize: '14px' }} onChange={handleInputChange}></textarea>
                                    <FiMapPin className="position-absolute bottom-0 end-0 m-3 text-muted opacity-25" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-center gap-3 mt-5 pt-3">
                            <button className="btn rounded-pill px-5 fw-bold text-muted border-0 py-3 bg-light shadow-none" style={{ fontSize: '13px' }}>İPTAL</button>
                            <button 
                                className="btn rounded-pill px-5 py-3 fw-bold text-white shadow-sm d-flex align-items-center gap-2" 
                                style={{ backgroundColor: '#9FB8A0', border: 'none', fontSize: '13px' }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                <FiSave /> {loading ? 'KAYDEDİLİYOR...' : 'YENİ MÜŞTERİ OLUŞTUR'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON: İŞLEM TAKİP & MÜŞTERİ YOLCULUĞU */}
                <div className="col-lg-4 d-flex flex-column gap-4">
                    {/* DOLULUK PANELİ */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '30px', padding: '40px', background: '#ffffff' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#D95F80', fontSize: '14px' }}>
                            <FiPieChart /> İşlem Takip Paneli
                        </h6>
                        <div className="text-center my-2">
                            <div className="position-relative d-inline-flex align-items-center justify-content-center">
                                <svg width="130" height="130">
                                    <circle cx="65" cy="65" r="55" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                                    <circle cx="65" cy="65" r="55" fill="none" stroke={progress === 100 ? '#9FB8A0' : '#D95F80'} strokeWidth="10" strokeDasharray="345" strokeDashoffset={345 - (345 * progress) / 100} strokeLinecap="round" style={{ transition: 'all 0.8s ease' }} />
                                </svg>
                                <div className="position-absolute text-center">
                                    <span className="d-block fw-bold text-dark" style={{ fontSize: '22px' }}>%{progress}</span>
                                    <span className="text-muted fw-medium" style={{ fontSize: '9px', letterSpacing: '1px' }}>DOLULUK</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center justify-content-between p-3 rounded-4 border-0 shadow-sm" style={{ backgroundColor: '#F0FDF4' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ color: '#9FB8A0', width: '32px', height: '32px' }}><FiCheckCircle size={16} /></div>
                                    <span className="small fw-bold" style={{ color: '#9FB8A0' }}>Veri Kalitesi</span>
                                </div>
                                <span className="small fw-bold text-muted">{progress > 75 ? 'Harika' : 'Düşük'}</span>
                            </div>
                        </div>
                    </div>

                    {/* MÜŞTERİ YOLCULUĞU (STAGES) */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '30px', padding: '30px', background: '#ffffff' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '14px' }}>
                            <FiClock style={{ color: '#D95F80' }} /> MÜŞTERİ YOLCULUĞU
                        </h6>
                        
                        {/* Stepper Line */}
                        <div className="position-relative mb-5 mt-2">
                           <div className="position-absolute w-100 bg-light" style={{ height: '4px', top: '10px', zIndex: 0 }}></div>
                           <div className="position-absolute bg-success opacity-50" style={{ height: '4px', top: '10px', width: '25%', zIndex: 1 }}></div>
                           
                           <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                                {['Lead', 'Analiz', 'Teklif', 'Anlaşma', 'Kazandı'].map((stage, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className={`rounded-circle mx-auto mb-2 shadow-sm d-flex align-items-center justify-content-center`} 
                                             style={{ 
                                                width: '24px', 
                                                height: '24px', 
                                                backgroundColor: idx === 0 ? '#9FB8A0' : (idx === 1 ? '#fff' : '#F1F5F9'),
                                                border: idx === 1 ? '4px solid #9FB8A0' : 'none'
                                             }}>
                                            {idx === 0 && <FiCheckCircle color="white" size={14} />}
                                        </div>
                                        <span className="text-muted fw-medium" style={{ fontSize: '10px' }}>{stage}</span>
                                    </div>
                                ))}
                           </div>
                        </div>

                        {/* AKSESUARLAR / OTOMASYONLAR */}
                        <div className="vstack gap-3 mt-2">
                            <span className="fw-bold text-muted small mb-1" style={{ letterSpacing: '1px' }}>AKSESUARLAR</span>
                            
                            <div className="d-flex align-items-center justify-content-between p-3 rounded-4 border-0 shadow-sm" style={{ backgroundColor: '#F0FDF4' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}><FiCheckCircle /></div>
                                    <span className="small fw-bold text-success">Hoş Geldin Maili Gönderildi</span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between p-3 rounded-4 border shadow-sm transition-all" style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-light p-2 rounded-circle text-muted d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}><FiPlusCircle /></div>
                                    <span className="small fw-bold text-muted">Görev Oluştur</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-top text-center">
                           <span className="text-muted" style={{ fontSize: '11px' }}>Tüm bilgiler KVKK uyumlu...</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-input-wrapper { transition: all 0.3s ease; border: 2px solid transparent !important; }
                .custom-input-wrapper:focus-within { border-color: #FFE4E9 !important; background-color: #fff !important; }
                .custom-input-wrapper-phone { transition: all 0.3s ease; border: 2px solid transparent !important; }
                .custom-input-wrapper-phone:focus-within { border-color: #E2E8F0 !important; background-color: #fff !important; }
                .transition-all { transition: all 0.3s ease; }
                .transition-all:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    )
}

export default CreateCustomer;