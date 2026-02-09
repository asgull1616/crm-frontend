'use client'
import React from 'react'
import { 
  FiUser, FiMail, FiActivity, FiBriefcase, FiHash, 
  FiGlobe, FiMapPin, FiPlus, FiEdit2, FiClock, FiCheckCircle 
} from 'react-icons/fi'

const CustomerViewPage = () => {
  // Bu veriler normalde API'den gelecek (Zeynep Daş için örnek veri)
  const customer = {
    fullName: 'Zeynep Daş',
    email: 'zeynep@gmail.com',
    phone: '+90 532 000 00 00',
    company: 'Codyol Digital',
    taxNumber: '1234567890',
    website: 'www.codyol.com',
    address: 'Yalova, Türkiye',
    status: 'VIP',
    memberSince: 'Ocak 2026'
  };

  return (
    <div className="main-content" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px' }}>
      
      {/* 1. ÜST PROFİL KARTI (HEADER) */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '30px', padding: '35px', background: '#ffffff' }}>
        <div className="d-flex align-items-center gap-4">
          {/* Profil Avatarı */}
          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px', color: '#D95F80' }}>
            <FiUser size={45} />
          </div>
          
          {/* İsim ve Üyelik Bilgisi */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="fw-bold mb-0" style={{ color: '#1F2937' }}>{customer.fullName}</h2>
              <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '11px', letterSpacing: '0.5px' }}>{customer.status}</span>
              <span className="text-muted small ms-2">ID-2301</span>
            </div>
            <p className="text-muted mb-0">{customer.company} | İstanbul</p>
            <span className="text-muted" style={{ fontSize: '12px' }}>Üyelik Tarihi: {customer.memberSince}</span>
          </div>

          {/* Aksiyon Butonları */}
          <div className="d-flex gap-2">
            <button className="btn rounded-pill px-4 py-2 text-white fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#D95F80', border: 'none', fontSize: '13px' }}>
              <FiPlus /> GÖREV EKLE
            </button>
            <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
              <FiEdit2 size={18} className="text-muted" />
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* 2. SOL KOLON: PROFİL DETAYLARI VE ADRES */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '25px', background: '#ffffff' }}>
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#374151' }}>
              <FiUser className="text-muted" /> Profil Detayları
            </h6>
            <div className="vstack gap-3">
              {[
                { label: 'E-posta', value: customer.email, icon: <FiMail /> },
                { label: 'Telefon', value: customer.phone, icon: <FiActivity /> },
                { label: 'Şirket', value: customer.company, icon: <FiBriefcase /> },
                { label: 'Vergi No', value: customer.taxNumber, icon: <FiHash /> }
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-4 border-0" style={{ backgroundColor: '#F9FAFB' }}>
                  <div className="d-flex align-items-center gap-3 text-muted">
                    {item.icon}
                    <span className="small fw-medium">{item.label}</span>
                  </div>
                  <span className="small fw-bold text-dark">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '25px', background: '#ffffff' }}>
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#374151' }}>
              <FiMapPin className="text-muted" /> Adres Bilgisi
            </h6>
            <div className="vstack gap-3">
               <div className="p-3 rounded-4" style={{ backgroundColor: '#F9FAFB' }}>
                  <span className="d-block text-muted small mb-1">Website</span>
                  <span className="small fw-bold text-primary">{customer.website}</span>
               </div>
               <div className="p-3 rounded-4" style={{ backgroundColor: '#F9FAFB' }}>
                  <span className="d-block text-muted small mb-1">Adres Bilgisi</span>
                  <span className="small fw-bold">{customer.address}</span>
               </div>
            </div>
          </div>
        </div>

        {/* 3. SAĞ KOLON: AKTİVİTE VE YOLCULUK */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '25px', background: '#ffffff' }}>
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#374151' }}>
              <FiActivity className="text-muted" /> Aktivite
            </h6>
            <span className="small text-muted fw-bold mb-3 d-block">Müşteri Yolculuğu</span>
            
            {/* Yolculuk Stepper Çizgisi */}
            <div className="position-relative py-4">
              <div className="position-absolute w-100 bg-light" style={{ height: '4px', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}></div>
              <div className="position-absolute bg-success opacity-25" style={{ height: '4px', top: '50%', transform: 'translateY(-50%)', width: '50%', zIndex: 1 }}></div>
              
              <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                {['Lead', 'Analiz', 'Teklif', 'Anlaşma', 'Kazandı'].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm" 
                         style={{ 
                           width: '28px', 
                           height: '28px', 
                           backgroundColor: idx <= 2 ? '#9FB8A0' : '#fff',
                           border: idx > 2 ? '2px solid #E5E7EB' : 'none'
                         }}>
                      {idx <= 2 ? <FiCheckCircle color="white" size={16} /> : <div className="rounded-circle bg-light" style={{width: '8px', height: '8px'}}></div>}
                    </div>
                    <span className="text-muted" style={{ fontSize: '10px', fontWeight: '500' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '25px', background: '#ffffff' }}>
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#374151' }}>
              <FiClock className="text-muted" /> Son İşlemler
            </h6>
            <div className="vstack gap-3">
              {[
                { title: 'Codyol Digital', date: '21.01.2026', time: '20:41' },
                { title: 'Arama Yapıldı', date: '19.01.2026', time: '14:20' }
              ].map((log, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 text-muted"><FiMail size={14} /></div>
                    <span className="small fw-bold">{log.title}</span>
                  </div>
                  <span className="text-muted" style={{ fontSize: '11px' }}>{log.date} {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-content {
          font-family: 'Inter', sans-serif;
        }
        .card {
          transition: transform 0.2s;
        }
        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

export default CustomerViewPage;