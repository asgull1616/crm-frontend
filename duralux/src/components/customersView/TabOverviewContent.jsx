import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { projectsData } from '@/utils/fackData/projectsData'
import ImageGroup from '@/components/shared/ImageGroup'
import HorizontalProgress from '@/components/shared/HorizontalProgress';
import TeamsCreateHeader from '@/components/teamsViewCreate/TeamsCreateHeader';

const TabOverviewContent = ({ customer }) => {
    return (
        <div
            className="tab-pane fade show active p-4"
            id="overviewTab"
            role="tabpanel"
        >
            {/* MÜŞTERİ HAKKINDA */}
            <div className="about-section mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Müşteri Hakkında:</h5>
                </div>

                <p>{customer.description || 'Açıklama bulunmuyor.'}</p>
            </div>

            {/* PROFİL DETAYLARI */}
            <div className="profile-details mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Profil Detayları:</h5>
                </div>

                <div className="row g-0 mb-4">
                    <div className="col-sm-6 text-muted">İsim Soyisim:</div>
                    <div className="col-sm-6 fw-semibold">{customer.fullName}</div>
                </div>

                <div className="row g-0 mb-4">
                    <div className="col-sm-6 text-muted">Email:</div>
                    <div className="col-sm-6 fw-semibold">{customer.email || '-'}</div>
                </div>

                <div className="row g-0 mb-4">
                    <div className="col-sm-6 text-muted">Telefon:</div>
                    <div className="col-sm-6 fw-semibold">{customer.phone || '-'}</div>
                </div>

                <div className="row g-0 mb-4">
                    <div className="col-sm-6 text-muted">Şirket:</div>
                    <div className="col-sm-6 fw-semibold">{customer.companyName || '-'}</div>
                </div>

                <div className="row g-0 mb-4">
                    <div className="col-sm-6 text-muted">Durum:</div>
                    <div className="col-sm-6 fw-semibold">{customer.status}</div>
                </div>

                <div className="row g-0">
                    <div className="col-sm-6 text-muted">Oluşturulma Tarihi:</div>
                    <div className="col-sm-6 fw-semibold">
                        {new Date(customer.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabOverviewContent
