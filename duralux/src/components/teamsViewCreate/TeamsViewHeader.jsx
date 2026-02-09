'use client'
import React from 'react'
import { FiDelete, FiEdit, FiMoreHorizontal, FiPlus, FiPrinter, FiTrash2, FiUserX } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import topTost from '@/utils/topTost'
import Link from 'next/link'

const LeadsViewHeader = () => {
    const handleClick = () => {
        topTost()
    };

    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
           
        </div>
    )
}

export default LeadsViewHeader