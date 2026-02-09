'use client'
import React from 'react'
import { FiUsers, FiUserCheck, FiUserPlus, FiTrendingUp } from 'react-icons/fi'

const CustomersStatistics = () => {
    // #9FB8A0 (Adaçayı Yeşili) ve #E92B63 (Canlı Pembe) Odaklı Tasarım
    const getStyles = (color) => {
        const styles = {
            // Ana Vurgu: Canlı Pembe
            primary: { bg: 'rgba(233, 43, 99, 0.1)', icon: '#E92B63', trend: '#E92B63' }, 
            // Başarı ve Stabilite: Adaçayı Yeşili
            success: { bg: 'rgba(159, 184, 160, 0.15)', icon: '#9FB8A0', trend: '#9FB8A0' }, 
            // İletişim: Soft Gri-Yeşil
            info:    { bg: 'rgba(59, 130, 246, 0.1)', icon: '#3B82F6' , trend: '#3B82F6' },
            // Kayıp/Uyarı: Soft Pembe
            warning: { bg: 'rgba(233, 43, 99, 0.05)', icon: '#b54d6a', trend: '#b54d6a' }
        };
        return styles[color] || styles.primary;
    };

    const stats = [
        { label: 'Toplam Müşteri', value: '26,595', icon: <FiUsers />, color: 'primary', trend: '%38.85' },
        { label: 'Aktif Müşteriler', value: '2,245', icon: <FiUserCheck />, color: 'success', trend: '%24.58' },
        { label: 'İletişim Kuruldu', value: '1,254', icon: <FiUserPlus />, color: 'info', trend: '%33.29' },
        { label: 'Kaybedildi', value: '4,586', icon: <FiTrendingUp />, color: 'warning', trend: '%42.47' },
    ];

    return (
        <>
            {stats.map((stat, index) => {
                const style = getStyles(stat.color);
                return (
                    <div className="col-xxl-3 col-md-6 mb-4" key={index}>
                        <div className="card border-0 shadow-sm h-100 bg-white" 
                             style={{ 
                                 borderRadius: '24px',
                                 transition: 'transform 0.3s ease' 
                             }}>
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h2 className="fw-bold mb-1" style={{ color: '#1e293b', letterSpacing: '-1px' }}>
                                            {stat.value}
                                        </h2>
                                        <p className="text-muted small fw-medium text-uppercase mb-0" style={{ fontSize: '11px' }}>
                                            {stat.label}
                                        </p>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" 
                                         style={{ 
                                             width: '56px', 
                                             height: '56px', 
                                             backgroundColor: style.bg, 
                                             color: style.icon, 
                                             fontSize: '24px',
                                             boxShadow: `0 4px 10px ${style.bg}`
                                         }}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-top border-light">
                                    <span className="small fw-bold" style={{ color: style.trend }}>
                                        <FiTrendingUp className="me-1" /> {stat.trend}
                                    </span>
                                    <span className="text-muted small ms-2">geçen aydan beri</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    )
}

export default CustomersStatistics;