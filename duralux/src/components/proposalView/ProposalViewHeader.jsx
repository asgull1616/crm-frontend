import React from 'react'
import { FiLayers } from 'react-icons/fi'

const ProposalViewHeader = () => {
    return (
     <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
    <a href="#" className="btn btn-light-brand" data-bs-toggle="offcanvas" data-bs-target="#proposalSent">
        <FiLayers size={16} className='me-2'/>
        <span>Kaydet & Gönder</span>
    </a>
    <a 
        href="#" 
        className="btn text-white" // 'btn-primary' silindi, yazı beyaz kalsın diye text-white eklendi
        style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Senin özel rengin eklendi
        data-bs-toggle="offcanvas" 
        data-bs-target="#proposalSent"
    >
        Teklifi Gönder
    </a>
</div>
    )
}

export default ProposalViewHeader