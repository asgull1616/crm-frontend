import React from 'react'
import { FiMoreVertical, FiPlus, FiShare2 } from 'react-icons/fi'
import getIcon from '@/utils/getIcon'
import Link from 'next/link'

const socialLinkOptions = [
    // { label: "Github", icon: "feather-github", shareCount: "39.57K" },
    // { label: "Twitter", icon: "feather-twitter", shareCount: "64.37K" },
    // { label: "Youtube", icon: "feather-youtube", shareCount: "53.76K" },
    // { label: "Linkedin", icon: "feather-linkedin", shareCount: "42.69K" },
    // { label: "Facebook", icon: "feather-facebook", shareCount: "95.65K" },
    // { label: "Instagram", icon: "feather-instagram", shareCount: "32.69K" },
    // { type: "divider" },
    { label: "Bağlantıyı Kopyala", icon: "feather-link", shareCount: "" },
    // { label: "Share via QR", icon: "feather-grid", shareCount: "" },
    { label: "E-posta ile Gönder", icon: "feather-mail", shareCount: "" },
   /* { label: "Share via Message", icon: "feather-message-square", shareCount: "" },*/
]
const moreOptions = [
    { label: "Görevi Sabitle", icon: "feather-map-pin" },
    { label: "Görevi Düzenle", icon: "feather-edit" },
    { label: "Görevi Kopyala", icon: "feather-copy" },
    { type: "divider" },
    { label: "Beklemeye Al", icon: "feather-pause" },
    { label: "Başlatıldı Olarak İşaretle", icon: "feather-star" },
    { label: "Tamamlandı Olarak İşaretle", icon: "feather-check-circle" },
    { label: "İptal Et", icon: "feather-delete" },
    { type: "divider" },
    // { label: "Export Project", icon: "feather-cast" },
    { label: "Görevi Gör", icon: "feather-eye" },
    { type: "divider" },
    { label: "Görevi Sil", icon: "feather-trash-2" },
]
const ProjectViewHeader = () => {
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <div className="filter-dropdown">
                <a className="btn btn-icon btn-light-brand" data-bs-toggle="dropdown" data-bs-offset="0, 10" data-bs-auto-close="outside">
                    <i className='lh-1'><FiMoreVertical /></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                    {
                        moreOptions.map(({ icon, label, type }, index) => {
                            if (type === "divider") {
                                return <li key={index} className="dropdown-divider"></li>
                            }
                            return (
                                <li key={index}>
                                    <a href="#" className="dropdown-item">
                                        <i className='me-3'>{getIcon(icon)}</i>
                                        <span>{label}</span>
                                    </a>
                                </li>
                            )
                        })
                    }
                </div>
            </div>
            <Link href="/projects/create" className="btn btn-primary">
                <FiPlus size={16} className='me-2' />
                <span>Görev Oluştur</span>
            </Link>
            <div className="filter-dropdown">
                <a href="#" className="btn btn-primary" data-bs-toggle="dropdown" data-bs-offset="0,11">
                    <FiShare2 size={16} className='me-2' />
                    <span>Görevi Paylaş</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-start">
                    {
                        socialLinkOptions.map(({ icon, label, shareCount, type }, index) => {
                            if (type === "divider") {
                                return <li key={index} className="dropdown-divider"></li>
                            }
                            return (
                                <li key={index}>
                                    <a href="#" className="dropdown-item">
                                        <i className='me-3'>{getIcon(icon)}</i>
                                        <span>{label}</span>
                                        <span className="fs-10 text-gray-500 ms-2">({shareCount})</span>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>


    )
}

export default ProjectViewHeader