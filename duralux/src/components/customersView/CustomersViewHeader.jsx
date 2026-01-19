'use client'
import React from 'react'
import { FiEye, FiPlus, FiStar } from 'react-icons/fi'
import topTost from '@/utils/topTost';
import Link from 'next/link';

const CustomersViewHeader = () => {
    const handleClick = () => {
        topTost()
    };
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
         
            <Link href="/customers/create" className="btn btn-primary">
                <FiPlus size={16} className='me-2' />
                <span>Müşteri Oluştur</span>
            </Link>
        </div>
    )
}

export default CustomersViewHeader