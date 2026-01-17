import React, { Fragment } from 'react'
import { FiChevronRight, FiPlus } from 'react-icons/fi'
import getIcon from '@/utils/getIcon';
import Link from 'next/link';
 
const menuData = [
    {
        name: 'Teklifler',
        icon: 'feather-at-sign', 
        subMenu: [
            { name: "Teklifleri Görüntüle", path: "/proposal/list", },
            { name: "Teklif Oluştur", path: "/proposal/create", },
        ],
    },
 
        {
        name: 'Müşteriler',
        icon: 'feather-users',
        subMenu: [
            { name: "Müşterilei Görüntüle", path: "/customers/list" },
            { name: "Müşteri Oluştur", path: "/customers/create" }
        ],
    },
    {
        name: 'Ekipler',
        icon: 'feather-alert-circle',
        subMenu: [
            { name: 'Ekipleri Görüntüle', path: '/leads/list' },
            { name: 'Ekipler Oluştur', path: '/leads/create' }
        ]
    },
    {
        name: 'Görevler',
        icon: 'feather-briefcase',
        subMenu: [
            { name: 'Görevleri Görüntüle', path: '/projects/list' },
            { name: 'Görev Oluştur', path: '/projects/create' }
        ]
    },

];


const HeaderDropDownModal = () => {
    return (
        <div className="dropdown nxl-h-item nxl-lavel-menu">
            <Link href="#" className="avatar-text avatar-md bg-primary text-white" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                <FiPlus size={12} />
            </Link>
            <div className="dropdown-menu nxl-h-dropdown">
                {menuData.map((menu, index) => (
                    <Fragment key={index}>
                        <div className="dropdown nxl-level-menu">
                            <Link href="#" className="dropdown-item text-capitalize">
                                <span className="hstack">
                                    <i>{getIcon(menu.icon)}</i>
                                    <span>{menu.name}</span>
                                </span>
                                <i className="ms-auto me-0"><FiChevronRight /></i>
                            </Link>
                            <div className="dropdown-menu nxl-h-dropdown">
                                {menu.subMenu.map((subItem, subIndex) => (
                                    <div key={subIndex} className="dropdown nxl-level-menu">
                                        <Link href={subItem.path || '#'} className="dropdown-item text-capitalize">
                                            <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3"></i>
                                            <span>{subItem.name}</span>
                                            {subItem.subSubMenu && <i className="ms-auto me-0"><FiChevronRight /></i>}
                                        </Link>
                                        {subItem.subSubMenu && (
                                            <div className="dropdown-menu nxl-h-dropdown">
                                                {subItem.subSubMenu.map((subSubItem, subSubIndex) => (
                                                    <Link key={subSubIndex} href={subSubItem.path} className="dropdown-item text-capitalize">
                                                        <span>{subSubItem.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {index === 0 && <div className="dropdown-divider"></div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default HeaderDropDownModal
