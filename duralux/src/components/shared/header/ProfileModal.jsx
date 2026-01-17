'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FiActivity, FiBell, FiChevronRight, FiDollarSign, FiLogOut, FiSettings, FiUser } from "react-icons/fi"


const activePosition = ["Active", "Always", "Bussy", "Inactive", "Disabled", "Cutomization"]
const subscriptionsList = ["Plan", "Billings", "Referrals", "Payments", "Statements", "Subscriptions"]
const ProfileModal = () => {
    return (
        <div className="dropdown nxl-h-item">
            <a
  href="#"
  data-bs-toggle="dropdown"
  role="button"
  data-bs-auto-close="outside"
>
  <div
    className="d-flex align-items-center justify-content-center user-avtar me-0"
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#EEF1F6'
    }}
  >
    <FiUser size={20} />
  </div>
</a>

            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                        <div>
                            <h6 className="text-dark mb-0">Alexandra Della </h6>
                            <span className="fs-12 fw-medium text-muted">alex.della@outlook.com</span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-item"></div>
                 <Link href="/leads/view" className="dropdown-item">
                    <i ><FiUser /></i>
                    <span>Profil Detayları</span>
             
                 </Link>
                <a href="#" className="dropdown-item">
                    <i><FiSettings /></i>
                    <span>Hesap Ayarları</span>
                </a>
                <div className="dropdown-divider"></div>
                      <Link href="/authentication/login/minimal" className="dropdown-item">
                    <i> <FiLogOut /></i>
                    <span>Çıkış Yap</span>
                </Link>
            </div>
        </div>
    )
}

export default ProfileModal

const getColor = (item) => {
    switch (item) {
        case "Always":
            return "always_clr"
        case "Bussy":
            return "bussy_clr"
        case "Inactive":
            return "inactive_clr"
        case "Disabled":
            return "disabled_clr"
        case "Cutomization":
            return "cutomization_clr"
        default:
            return "active-clr";
    }
}