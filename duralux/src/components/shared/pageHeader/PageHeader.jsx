'use client'
import React, { useState } from 'react'
import { FiAlignRight, FiArrowLeft } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const PageHeader = ({ children }) => {
    const [openSidebar, setOpenSidebar] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const segments = pathname.split('/').filter(Boolean)

    const moduleName = segments[0] || "dashboard"
    const lastSegment = segments[segments.length - 1]

    let action = "Liste"

    if (segments.length === 1) {
        action = "Liste"
    } else if (lastSegment === "create") {
        action = "Yeni Oluştur"
    } else if (lastSegment === "edit") {
        action = "Düzenleme"
    } else if (!isNaN(lastSegment)) {
        action = "Detay Görüntüleme"
    }

    const handleBack = (e) => {
        e.preventDefault()

        if (window.history.length > 1) {
            router.back()
        } else {
            router.push(`/${moduleName}`)
        }
    }

    return (
        <div className="page-header">
            <div className="page-header-left d-flex align-items-center">

                <a href="#" onClick={handleBack} className="back-btn me-3">
                    <FiArrowLeft size={18} />
                </a>

                <div className="page-header-title">
                    <span className="module-name text-capitalize">
                        {moduleName}
                    </span>
                    <h4 className="page-main-title">
                        {action}
                    </h4>
                </div>
            </div>

            <div className="page-header-right ms-auto">
                {children}
            </div>
        </div>
    )
}

export default PageHeader
