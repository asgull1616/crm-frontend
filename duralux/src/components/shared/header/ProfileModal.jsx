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
        className="d-flex align-items-center justify-content-center user-avatar-icon"
      >
        <FiUser size={22} />
      </a>

      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
        <div className="dropdown-header">
          <div className="d-flex align-items-center">
            <div>
              <h6 className="text-dark mb-0">Eren Gündoğdu </h6>
              <span className="fs-12 fw-medium text-muted">erenggundogdu@gmail.com</span>
            </div>
          </div>
        </div>

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