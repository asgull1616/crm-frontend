'use client'
import React from 'react'
import { FiLayers, FiSave } from 'react-icons/fi'

const ProposalEditHeader = ({ onSubmit, onSend }) => (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        <button className="btn btn-light-brand" onClick={onSend}>
            <FiLayers size={16} className="me-2" />
            Kaydet & Gönder
        </button>

        <button className="btn btn-primary" onClick={onSubmit}>
            <FiSave size={16} className="me-2" />
            Kaydet
        </button>
    </div>
)

export default ProposalEditHeader
