'use client'
import React from 'react'
import { FiUserPlus } from 'react-icons/fi'

const CustomersCreateHeader = ({ onSubmit }) => {
  return (
    <div className="d-flex justify-content-end align-items-center gap-2 page-footer-actions">
      <button
        className="btn btn-primary"
        type="button"
        onClick={onSubmit}
      >
        <FiUserPlus size={20} className="me-2" />
        Müşteri Oluştur
      </button>
    </div>
  )
}

export default CustomersCreateHeader
