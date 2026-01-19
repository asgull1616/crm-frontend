import React from 'react'
import { FiArchive, FiBarChart, FiBell, FiBookOpen, FiBriefcase, FiCheck, FiEye, FiFilter, FiPaperclip, FiPlus, FiSend, FiShield, FiUser, FiWifiOff } from 'react-icons/fi'
import { BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx, BsFiletypeXml, BsPrinter } from 'react-icons/bs';
import Dropdown from '@/components/shared/Dropdown';
import Link from 'next/link';

export const filterAction = [
    { label: "All", icon: <FiEye /> },
    { label: "Sent", icon: <FiSend /> },
    { label: "Open", icon: <FiBookOpen /> },
    { label: "Draft", icon: <FiArchive /> },
    { label: "Revised", icon: <FiBell /> },
    { label: "Declined", icon: <FiShield /> },
    { label: "Accepted", icon: <FiCheck /> },
    { label: "Leads", icon: <FiBriefcase /> },
    { label: "Expired", icon: <FiWifiOff /> },
    { label: "Customers", icon: <FiUser /> },
];
export const fileType = [
    { label: "PDF", icon: <BsFiletypePdf /> },
    // { label: "CSV", icon: <BsFiletypeCsv /> },
    // { label: "XML", icon: <BsFiletypeXml /> },
    { label: "Text", icon: <BsFiletypeTsx /> },
    { label: "Excel", icon: <BsFiletypeExe /> },
    { label: "Print", icon: <BsPrinter /> },
];

const ProposalHeadr = () => {
    return (
        <>
           <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
  <Link
    href="/proposal/create"
    className="btn text-white"
    style={{
      backgroundColor: '#E92B63',
      borderColor: '#E92B63'
    }}
  >
    <FiPlus size={16} className="me-2" />
    <span>Yeni Teklifler</span>
  </Link>
</div>

        </>
    )
}

export default ProposalHeadr