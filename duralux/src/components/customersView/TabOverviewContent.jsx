import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { projectsData } from '@/utils/fackData/projectsData'
import ImageGroup from '@/components/shared/ImageGroup'
import HorizontalProgress from '@/components/shared/HorizontalProgress';

const informationData = [
    { label: 'İsim Soyisim', value: 'Alexandra Della' },
    { label: 'Soyisim', value: 'Della' },
    { label: 'Şirket', value: 'Theme Ocean' },
    { label: 'Doğum Tarihi', value: '26 May, 2000' },
    { label: 'Telefon Numarası', value: '+01 (375) 5896 3214' },
    { label: 'Email Adresi', value: 'alex.della@outlook.com' },
    { label: 'Konum', value: 'California, United States' },
    { label: 'İşe Başlama Tarihi', value: '20 Dec, 2023' },
    { label: 'Ülke', value: 'United States' },
    { label: 'İletişim', value: 'Email, Phone' },
    { label: 'Değişikliklere İzin Ver', value: 'YES' },
    { label: 'Website', value: 'https://wrapbootstrap.com/user/theme_ocean' },
];
const TabOverviewContent = () => {
    return (
        <div
            className="tab-pane fade show active p-4"
            id="overviewTab"
            role="tabpanel"
        >
            <div className="about-section mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Müşteri Hakkında:</h5>
                    <a href="#" className="btn btn-sm btn-light-brand">
                        Güncelle
                    </a>
                </div>
                <p>
                  Buraya
                </p>
                <p>
                    müşteri
                </p>
                <p>
                  bilgileri.
                </p>
            </div>
            <div className="profile-details mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Profil Detayları:</h5>
                    <a href="#" className="btn btn-sm btn-light-brand">
                        Profili Düzenle
                    </a>
                </div>
                {informationData.map((item, index) => (
                    <div key={index}  className={`row g-0 ${index === informationData.length - 1 ? 'mb-0' : 'mb-4'}`}>
                        <div className="col-sm-6 text-muted">{item.label}:</div>
                        <div className="col-sm-6 fw-semibold">{item.value}</div>
                    </div>
                ))}
            </div>
            {/* <div
                className="alert alert-dismissible mb-4 p-4 d-flex alert-soft-warning-message profile-overview-alert"
                role="alert"
            >
                <div className="me-4 d-none d-md-block">
                    <FiAlertTriangle className='fs-1' />
                </div>
                <div>
                    <p className="fw-bold mb-1 text-truncate-1-line">
                        Your profile has not been updated yet!!!
                    </p>
                    <p className="fs-10 fw-medium text-uppercase text-truncate-1-line">
                        Last Update: <strong>26 Dec, 2023</strong>
                    </p>
                    <a
                        href="#"
                        className="btn btn-sm bg-soft-warning text-warning d-inline-block"
                    >
                        Update Now
                    </a>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    />
                </div>
            </div> */}
            <div className="project-section">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Proje Detayları:</h5>
                    <a href="#" className="btn btn-sm btn-light-brand">
                        Görüntüle
                    </a>
                </div>
                {/* <div className="row">
                    {
                        projectsData.runningProjects.slice(0, 2).map(({ id, progress, project_logo, project_category, project_name, status, team_members, progress_color, badge_color }) => (
                            <div key={id} className="col-xxl-6 col-xl-12 col-md-6">
                                <div className="border border-dashed border-gray-5 rounded mb-4 md-lg-0">
                                    <div className="p-4">
                                        <div className="d-sm-flex align-items-center">
                                            <div className="wd-50 ht-50 p-2 bg-gray-200 rounded-2">
                                                <img
                                                    src={project_logo}
                                                    className="img-fluid"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ms-0 mt-4 ms-sm-3 mt-sm-0">
                                                <a href="#" className="d-block">
                                                    {project_name}
                                                </a>
                                                <div className="fs-12 d-block text-muted">{project_category}</div>
                                            </div>
                                        </div>
                                        <div className="my-4 text-muted text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
                                            dolorem necessitatibus temporibus nemo commodi eaque dignissimos
                                            itaque unde hic, sed rerum doloribus possimus minima nobis porro
                                            facilis voluptatum atque asperiores perspiciatis saepe laboriosam
                                            rem cupiditate libero sit.
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="img-group lh-0 ms-3">
                                                <ImageGroup data={team_members} avatarStyle={"bg-soft-primary"} />
                                            </div>
                                            <div className={`badge ${badge_color}`}>
                                                {status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 border-top border-top-dashed border-gray-5 d-flex justify-content-between gap-2">
                                        <div className="w-75 d-none d-md-block">
                                            <small className="mb-1 fs-11 fw-medium text-uppercase text-muted d-flex align-items-center justify-content-between">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </small>
                                            <HorizontalProgress progress={progress} barColor={progress_color} />
                                        </div>
                                        <span className="mx-2 text-gray-400 d-none d-md-block">|</span>
                                        <a href="#" className="fs-12 fw-bold">
                                            View →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div> */}
            </div>
        </div>

    )
}

export default TabOverviewContent