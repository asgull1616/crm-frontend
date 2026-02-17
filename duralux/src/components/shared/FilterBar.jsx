'use client'

import { useState } from 'react'
import { FiSearch, FiCalendar, FiUser, FiFilter } from 'react-icons/fi'

export default function FilterBar({
    showSearch = false,
    showMonth = false,
    showYear = false,
    showStatus = false,
    showUser = false,
    showCustomer = false,
    showType = false,
    customers = [],
    users = [],
    onChange
}) {

    const currentYear = new Date().getFullYear()

    const handleChange = (key, value) => {
        onChange(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <div className="modern-filter-bar">

            {showSearch && (
                <div className="filter-item search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Ara..."
                        onChange={e => handleChange('search', e.target.value)}
                    />
                </div>
            )}

            {showMonth && (
                <div className="filter-item">
                    <FiCalendar />
                    <select onChange={e => handleChange('month', e.target.value)}>
                        <option value="">Ay</option>
                        {[
                            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
                        ].map((m, i) => (
                            <option key={i} value={i + 1}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showYear && (
                <div className="filter-item">
                    <select onChange={e => handleChange('year', e.target.value)}>
                        <option value="">Yıl</option>
                        {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showStatus && (
                <div className="filter-item">
                    <FiFilter />
                    <select onChange={e => handleChange('status', e.target.value)}>
                        <option value="">Durum</option>
                        <option value="PAID">Ödendi</option>
                        <option value="PENDING">Bekliyor</option>
                    </select>
                </div>
            )}

            {showUser && (
                <div className="filter-item">
                    <FiUser />
                    <select onChange={e => handleChange('user', e.target.value)}>

                        <option value="">Çalışan</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.fullName}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {showCustomer && (
                <div className="filter-item">
                    <FiUser />
                    <select onChange={e => handleChange('customerId', e.target.value)}>
                        <option value="">Müşteri</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.fullName || c.name}
                            </option>
                        ))}

                    </select>
                </div>
            )}
            {showType && (
                <div className="filter-item">
                    <FiFilter />
                    <select onChange={e => handleChange('type', e.target.value)}>
                        <option value="">Tür</option>
                        <option value="INCOME">Gelir</option>
                        <option value="EXPENSE">Gider</option>
                    </select>
                </div>
            )}



        </div>
    )
}
