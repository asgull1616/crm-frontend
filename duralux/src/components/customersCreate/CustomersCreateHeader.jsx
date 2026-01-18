'use client'
import React from 'react'
import { FiLayers, FiUserPlus } from 'react-icons/fi'

const CustomersCreateHeader = ({ onSubmit }) => {
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            <button className="btn btn-light-brand" type="button">
                <FiLayers size={16} className="me-2" />
                Taslak Olarak Kaydet
            </button>

           <button 
    className="btn text-white" // 'btn-primary' sınıfını sildik, yazı beyaz kalsın diye text-white ekledik
    type="button" 
    style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Senin özel rengini ekledik
    onClick={onSubmit}
>
    <FiUserPlus size={16} className="me-2" />
    Müşteri Oluştur
</button>
        </div>
    )
}

export default CustomersCreateHeader
