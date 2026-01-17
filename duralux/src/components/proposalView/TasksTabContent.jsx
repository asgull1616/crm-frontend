// 'use client'
import React from 'react'
import { FiActivity, FiAirplay, FiArrowRight, FiAtSign, FiBarChart2, FiBell, FiCalendar, FiCheck, FiCheckCircle, FiClipboard, FiClock, FiDollarSign, FiEdit, FiEdit3, FiFileText, FiLifeBuoy, FiPlus, FiPower, FiSettings, FiStar, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import CheckList from '../CheckList'
import MultiSelectImg from '@/components/shared/MultiSelectImg'
import MultiSelectTags from '@/components/shared/MultiSelectTags'
import { taskAssigneeOptions } from '@/utils/options'

const checkListOptions = [
    { label: "New", icon: <FiAtSign /> },
    { label: "Event", icon: <FiCalendar /> },
    { label: "Snoozed", icon: <FiBell /> },
    { label: "Deleted", icon: <FiTrash2 /> },
    { type: "divider" },
    { label: "Settings", icon: <FiSettings />, },
    { label: "Tips & Tricks", icon: <FiLifeBuoy />, },
]

const tags = [
    { value: 'team', label: 'Team', color: '#3454d1' },
    { value: 'primary', label: 'Primary', color: '#41b2c4' },
    { value: 'updates', label: 'Updates', color: '#17c666' },
    { value: 'personal', label: 'Personal', color: '#ffa21d' },
    { value: 'promotions', label: 'Promotions', color: '#ea4d4d' },
    { value: 'custom', label: 'Custom', color: '#6610f2' },
    { value: 'important', label: 'Important', color: '#17c666' },
    { value: 'tomorrow', label: 'Tomorrow', color: '#283c50' },
    { value: 'review', label: 'Review', color: '#3dc7be' },
]

const status = [
    { label: "Taslak", color: "bg-primary" },
    { label: "Onaylandı", color: "bg-secondary" },
    { label: "Reddedildi", color: "bg-success" },
    { label: "Gönderildi", color: "bg-danger" },
    // { label: "Upcoming", color: "bg-warning" },
];
const priority = [
    { label: "Düşük", color: "bg-primary" },
    { label: "Orta", color: "bg-secondary" },
    { label: "Yüksek", color: "bg-success" },
    // { label: "High", color: "bg-warning" },
    // { label: "Urgent", color: "bg-danger" },
];

const TasksTabContent = () => {
    return (
        <div className="tab-pane fade" id="tasksTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                    </div>
                </div>
                <div className="col-xxl-8 col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Tanım</h5>
                            <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" title="Update Description">
                                <FiEdit strokeWidth={1.6} />
                            </a>
                        </div>
                        <div className="card-body">
                            <p>sadasdsd</p>
                            <ul className="list-unstyled text-muted mb-0">
                                <li className="d-flex align-items-start mb-3">
                                    <span className="avatar-text avatar-sm bg-soft-success text-success me-3">
                                        <FiCheck className='fs-10' />
                                    </span>
                                    <span>dsddds </span>
                                </li>
                                <li className="d-flex align-items-start mb-3">
                                    <span className="avatar-text avatar-sm bg-soft-success text-success me-3">
                                        <FiCheck className='fs-10' />
                                    </span>
                                    <span>ddd.</span>
                                </li>
                                <li className="d-flex align-items-start mb-3">
                                    <span className="avatar-text avatar-sm bg-soft-success text-success me-3">
                                        <FiCheck className='fs-10' />
                                    </span>
                                    <span>Vddssddcmaz.</span>
                                </li>
                                <li className="d-flex align-items-start mb-3">
                                    <span className="avatar-text avatar-sm bg-soft-success text-success me-3">
                                        <FiCheck className='fs-10' />
                                    </span>
                                    <span>vdsvsdvd. </span>
                                </li>
                                <li className="d-flex align-items-start mb-3">
                                    <span className="avatar-text avatar-sm bg-soft-success text-success me-3">
                                        <FiCheck className='fs-10' />
                                    </span>
                                    <span>dvsdvdsv </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                </div>
            // </div>
    )
}

export default TasksTabContent

const Card = ({ icon: Icon, title, link }) => {
    return (
        <div className="card border border-gray-2 rounded-2 my-2 overflow-hidden">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="wd-50 ht-50 bg-gray-100 me-3 d-flex align-items-center justify-content-center">
                        <FiFileText />
                    </div>
                    <a href={link}>{title}</a>
                </div>
                <a href={link} className="avatar-text avatar-sm me-3">
                    <FiArrowRight />
                </a>
            </div>
        </div>
    );
};
