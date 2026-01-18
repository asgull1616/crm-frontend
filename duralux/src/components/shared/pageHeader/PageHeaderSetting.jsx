'use client'
import React, { useContext } from 'react'
import { FiAlignLeft, FiSave } from 'react-icons/fi'
import topTost from '@/utils/topTost'
import { SettingSidebarContext } from '@/contentApi/settingSideBarProvider'

const PageHeaderSetting = () => {
    const x = useContext(SettingSidebarContext)
    const handleClick = () => {
        topTost()
    };

    return (
        <div className="content-area-header bg-white sticky-top">
            <div className="page-header-left">
                <a href="#" className="app-sidebar-open-trigger me-2" onClick={() => x.setSidebarOpen(true)}>
                    <FiAlignLeft className='fs-24' />
                </a>
            </div>
        <div className="page-header-right ms-auto">
    <div className="d-flex align-items-center gap-3 page-header-right-items-wrapper">
        <a href="#" className="text-danger">İptal</a>
        <a 
            href="#" 
            className="btn text-white" // 'btn-primary' sınıfını sildik, yazı beyaz kalsın diye text-white ekledik
            style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Seçtiğin özel rengi ekledik
            onClick={handleClick}
        >
            <FiSave size={16} className='me-2' />
            <span>Değişiklikleri Kaydet</span>
        </a>
    </div>
</div>
        </div>

    )
}

export default PageHeaderSetting