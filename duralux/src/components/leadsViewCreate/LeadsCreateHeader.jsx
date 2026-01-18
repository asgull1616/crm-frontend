'use client'
import React from 'react'
import { FiLayers, FiUserPlus } from 'react-icons/fi'
import topTost from '@/utils/topTost';

const LeadsCreateHeader = () => {
  const handleClick = () => {
    topTost()
};

  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <a href="#" className="btn btn-light-brand " onClick={handleClick}>
        <FiLayers size={16} className='me-2'/>
        <span>Kaydet</span>
      </a>
<a 
    href="#" 
    className="btn text-white" // 'btn-primary' sınıfını sildik, yazı beyaz kalsın diye text-white ekledik
    style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Senin özel rengini ekledik
    onClick={handleClick}
>
    <FiUserPlus size={16} className='me-2'/>
    <span>Ekip Üyesi Oluştur</span>
</a> 
    </div>
  )
}

export default LeadsCreateHeader