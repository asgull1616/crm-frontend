'use client'
import React from 'react'
import Link from 'next/link'
import { FiMoreVertical } from 'react-icons/fi'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import { userList } from '@/utils/fackData/userList'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import Image from 'next/image'

const LatestLeads = ({title}) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    return (
        <div className="col-xxl-8">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr className="border-b">
                                    <th scope="row">Müşteri</th>
                                    <th>Teklif</th>
                                    <th>Tarih</th>
                                    <th>Durum</th>
                                    <th className="text-end">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userList(0, 5).map(({ date, id, proposal, user_email, user_img, user_name, user_status, color }) => (
                                        <tr key={id} className='chat-single-item'>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {
                                                    }
                                                    <a href="#">
                                                        <span className="d-block">{user_name}</span>
                                                        <span className="fs-12 d-block fw-normal text-muted">{user_email}</span>
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-gray-200 text-dark">{proposal}</span>
                                            </td>
                                            <td>{date}</td>
                                            <td>
                                                <span className={`badge bg-soft-${color} text-${color}`}>{user_status}</span>
                                            </td>
                                            <td className="text-end">
                                                <Link href="#"><FiMoreVertical size={16} /></Link>
                                            </td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default LatestLeads
