'use client'
import React, { useState } from 'react'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import { taskStatusOptions } from '@/utils/options'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import getIcon from '@/utils/getIcon'
import Image from 'next/image'

const actionOptions = [
    { icon: <FiEdit3 />, label: 'Edit' },
    { icon: <FiPrinter />, label: 'Print' },
    { icon: <FiClock />, label: 'Remind' },
    { type: "divider" },
    { icon: <FiArchive />, label: 'Archive' },
    { icon: <FiAlertOctagon />, label: 'Report Spam' },
    { icon: <FiTrash2 />, label: 'Delete' }
]
const summaryData = [
    { invoiceNumber: '', avatar: '', name: '', email: '', code: '', date: '', icon: '', cardType: '', status: taskStatusOptions },
    
];
const InvoiceSummary = ({ title }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    const defaultStatusList = ["completed", "rejected", "completed", "pending", "completed"]

    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Coupon</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th className="wd-250">Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData.map(({ avatar, icon, cardType, code, date, email, invoiceNumber, name, status }, index) => {
                                    const statusValue = status.find((v) => v.value === defaultStatusList[index])
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href="#">{invoiceNumber}</a>
                                            </td>
                                            <td>
                                                <div className="hstack gap-3">
                                                    <div className="avatar-image">
                                                        <Image width={38} height={38} sizes='100vw' src={avatar} alt="" className="img-fluid" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{name}</div>
                                                        <div className="fs-12 text-muted">{email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge text-success border border-success border-dashed">{code}</span>
                                            </td>
                                            <td>{date}</td>
                                            <td><i className={`me-1 fs-18`}>{getIcon(icon)}</i>{cardType}</td>
                                            <td>
                                                <SelectDropdown
                                                    options={status}
                                                    selectedOption={selectedOption}
                                                    defaultSelect={statusValue?.value}
                                                    onSelectOption={(option) => setSelectedOption(option)}
                                                />
                                            </td>
                                            <td>
                                                <Dropdown dropdownItems={actionOptions} triggerClass='avatar-md ms-auto' triggerPosition={"0,28"} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer"> <Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default InvoiceSummary
