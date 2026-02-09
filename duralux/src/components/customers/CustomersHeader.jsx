'use client'
import React, { useState } from 'react'
import { FiFilter, FiPlus, FiSearch } from 'react-icons/fi'
import Link from 'next/link';

const CustomersHeader = () => {
    const [activeFilter, setActiveFilter] = useState('Hepsi');
    const filters = ['Hepsi', 'Aktif', 'Yeni', 'Pasif'];

    return (
        <div className="w-100">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 bg-white p-3 rounded-4 shadow-sm border-0">
                
                {/* Arama Çubuğu */}
                <div className="flex-grow-1 position-relative" style={{ maxWidth: '450px' }}>
                    <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                        <FiSearch size={18} />
                    </span>
                    <input 
                        type="text" 
                        className="form-control ps-5 py-2 bg-light border-0" 
                        placeholder="Müşteri adı, e-posta veya telefon ile ara..." 
                        style={{ borderRadius: '12px', height: '48px', fontSize: '14px' }}
                    />
                </div>

                {/* Tıklanabilir Durum Filtreleri */}
                <div className="d-flex gap-2 align-items-center bg-light p-1 rounded-pill px-2" style={{ border: '1px solid #eee' }}>
                    <span className="text-muted small fw-bold mx-2" style={{fontSize: '10px', letterSpacing: '1px'}}>DURUM</span>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${
                                activeFilter === filter 
                                ? 'btn-white shadow-sm text-primary border-0' 
                                : 'btn-transparent text-muted border-0'
                            }`}
                            style={{ fontSize: '13px' }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Yeni Müşteri Ekle Butonu */}
                <div className="hstack gap-2 ms-auto">
                    <button className="btn btn-light border shadow-sm btn-icon rounded-3" style={{width: '48px', height: '48px'}}>
                        <FiFilter size={18} />
                    </button>
                    <Link
                        href="/customers/create"
                        className="btn text-white d-flex align-items-center gap-2 shadow-sm border-0"
                        style={{
                            backgroundColor: "#E92B63",
                            padding: "0 25px",
                            borderRadius: "12px",
                            height: "48px"
                        }}
                    >
                        <FiPlus size={22} />
                        <span className="fw-bold small text-uppercase">Yeni Müşteri Ekle</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CustomersHeader