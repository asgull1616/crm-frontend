'use client'
import React from 'react'
import { FiLayers, FiUserPlus } from 'react-icons/fi'

const CustomersCreateHeader = ({ onSubmit }) => {
    return (
       <div className="d-flex align-items-center gap-2 justify-content-end w-100">

            <button
  className="btn text-white"
  type="button"
  onClick={onSubmit}
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
  }}
>
  <FiUserPlus size={24} className="me-2" />
  Müşteri Oluştur
</button>

        </div>
    )
}

export default CustomersCreateHeader
