'use client'

import PageHeader from '@/components/shared/pageHeader/PageHeader'
import AdminPayrollStats from '@/components/teams/payroll/AdminPayrollStats'
import AdminPayrollFilters from '@/components/teams/payroll/AdminPayrollFilters'
import SalarySummaryTable from '@/components/teams/payroll/SalarySummaryTable'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'

export default function AdminPayrollPage() {
    // 🔹 Filtreler
    const [draftFilters, setDraftFilters] = useState({
        month: '',
        year: '',
        status: '',
    })

    const [appliedFilters, setAppliedFilters] = useState({
        month: '',
        year: '',
        status: '',
    })

    // 🔹 Modal & Form
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [payrollForm, setPayrollForm] = useState({
        userId: '',
        month: '',
        year: '',
        netSalary: '',
        note: '',
    })

    // 🔹 Data
    const [employees, setEmployees] = useState([])
    const [payrolls, setPayrolls] = useState([])

    // 🔹 Çalışanlar
    useEffect(() => {
        api.get('/teams/users')
            .then(res => setEmployees(res.data.data))
            .catch(() => { })
    }, [])

    // 🔹 Bordrolar
    const fetchPayrolls = async () => {
        try {
            const [pendingRes, paidRes] = await Promise.all([
                api.get('/teams/payroll/pending'),
                api.get('/teams/payroll/paid'),
            ])

            setPayrolls([
                ...pendingRes.data,
                ...paidRes.data,
            ])
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchPayrolls()
    }, [])

    // 🔹 Filtrelenmiş bordrolar
    const filteredPayrolls = payrolls.filter(item => {
        if (appliedFilters.month && item.month !== Number(appliedFilters.month)) return false
        if (appliedFilters.year && item.year !== Number(appliedFilters.year)) return false
        if (appliedFilters.status && item.status !== appliedFilters.status) return false
        return true
    })

    // 🔹 ÜST KART İSTATİSTİKLERİ (GERÇEK VERİ)
    const stats = filteredPayrolls.reduce(
        (acc, item) => {
            const salary = item.netPayable ?? item.netSalary ?? 0

            if (item.status === 'PAID') {
                acc.totalPaidAmount += salary
                acc.paidCount += 1
            }

            if (item.status === 'PENDING') {
                acc.pendingCount += 1
            }

            if (item.user?.id) {
                acc.employeeIds.add(item.user.id)
            }

            return acc
        },
        {
            totalPaidAmount: 0,
            paidCount: 0,
            pendingCount: 0,
            employeeIds: new Set(),
        }
    )

    const payrollStats = {
        totalPaidAmount: stats.totalPaidAmount,
        paidCount: stats.paidCount,
        pendingCount: stats.pendingCount,
        employeeCount: stats.employeeIds.size,
    }

    // 🔹 Bordro oluştur
    const handleCreatePayroll = async () => {
        try {
            await api.post('/teams/payroll', {
                userId: payrollForm.userId,
                month: Number(payrollForm.month),
                year: Number(payrollForm.year),
                netSalary: Number(payrollForm.netSalary),
                note: payrollForm.note,
            })

            setShowCreateModal(false)
            setPayrollForm({
                userId: '',
                month: '',
                year: '',
                netSalary: '',
                note: '',
            })

            fetchPayrolls()
        } catch (err) {
            alert(err?.response?.data?.message || 'Hata oluştu')
        }
    }

    return (
        <>
            <PageHeader title="Bordro Yönetimi" />

            <div className="container-fluid mt-4">
                {/* 🔥 GERÇEK VERİLİ KARTLAR */}
                <AdminPayrollStats data={filteredPayrolls} />

                <div className="card payroll-card mt-4">
                    <div className="card-header payroll-card-header d-flex justify-content-between align-items-center">
                        <span>Bordro Listesi</span>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            + Yeni Bordro Ekle
                        </button>
                    </div>

                    <div className="card-body">
                        <AdminPayrollFilters
                            draftFilters={draftFilters}
                            setDraftFilters={setDraftFilters}
                            onApply={() => setAppliedFilters(draftFilters)}
                        />

                        <hr />

                        <SalarySummaryTable
                            data={filteredPayrolls}
                            mode="admin"
                        />
                    </div>
                </div>
            </div>

            {/* 🟣 Bordro Oluştur Modal */}
            {showCreateModal && (
                <div className="modal-backdrop-custom">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h5>Yeni Bordro Oluştur</h5>
                            <button className="btn-close" onClick={() => setShowCreateModal(false)} />
                        </div>

                        <div className="modal-body">
                            <select
                                className="form-select mb-3"
                                value={payrollForm.userId}
                                onChange={e => setPayrollForm({ ...payrollForm, userId: e.target.value })}
                            >
                                <option value="">Çalışan Seç</option>
                                {employees.map(u => (
                                    <option key={u.id} value={u.id}>{u.fullName}</option>
                                ))}
                            </select>

                            {/* Ay & Yıl */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Ay</label>
                                    <select
                                        className="form-select"
                                        value={payrollForm.month}
                                        onChange={e =>
                                            setPayrollForm({ ...payrollForm, month: e.target.value })
                                        }
                                    >
                                        <option value="">Ay Seç</option>
                                        {[
                                            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                                            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
                                        ].map((m, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Yıl</label>
                                    <select
                                        className="form-select"
                                        value={payrollForm.year}
                                        onChange={e =>
                                            setPayrollForm({ ...payrollForm, year: e.target.value })
                                        }
                                    >
                                        <option value="">Yıl Seç</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                            </div>
                            <input
                                type="number"
                                className="form-control mt-3"
                                placeholder="Net Maaş"
                                value={payrollForm.netSalary}
                                onChange={e => setPayrollForm({ ...payrollForm, netSalary: e.target.value })}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                İptal
                            </button>
                            <button className="btn btn-primary" onClick={handleCreatePayroll}>
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
