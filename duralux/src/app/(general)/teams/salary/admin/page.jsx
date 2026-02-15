'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import AdminSalaryStats from '@/components/teams/salary/AdminSalaryStats'
import AdminSalaryTable from '@/components/teams/salary/AdminSalaryTable'
import AdminSalaryModal from '@/components/teams/salary/AdminSalaryModal'
import api from '@/lib/axios'

export default function AdminSalaryPage() {
  const [salaryData, setSalaryData] = useState([])
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)

  // 🔹 Maaşları çek
  const fetchSalaries = async () => {
    try {
      const [pendingRes, paidRes] = await Promise.all([
        api.get('/teams/payroll/pending'),
        api.get('/teams/payroll/paid'),
      ])

      setSalaryData([...pendingRes.data, ...paidRes.data])
    } catch (err) {
      console.error('Maaşlar alınamadı:', err)
    }
  }

  // 🔹 Çalışanları çek
  const fetchEmployees = async () => {
    try {
      const res = await api.get('/teams/users')
      setEmployees(res.data.data)
    } catch (err) {
      console.error('Çalışanlar alınamadı:', err)
    }
  }

  useEffect(() => {
    fetchSalaries()
    fetchEmployees()
  }, [])

  return (
    <>
      <PageHeader title="Maaş Yönetimi" />

      <div className="container-fluid mt-4">

        {/* 📊 Üst İstatistik Kartları */}
        <AdminSalaryStats data={salaryData} />

        {/* 📋 Maaş Listesi */}
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Maaş Listesi</span>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Maaş Hesapla
            </button>
          </div>

          <div className="card-body">
            <AdminSalaryTable
              data={salaryData}
              refresh={fetchSalaries}
            />
          </div>
        </div>
      </div>

      {/* 🟣 Maaş Hesaplama Modalı */}
      {showModal && (
        <AdminSalaryModal
          employees={employees}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchSalaries()
          }}
        />
      )}
    </>
  )
}
