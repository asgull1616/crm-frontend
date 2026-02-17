'use client'
import React, { useEffect, useState } from 'react'
import { FiUsers, FiTrash2, FiEdit3, FiMail, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'
import { customerService } from '@/lib/services/customer.service'
import Swal from 'sweetalert2';

const CustomersTable = ({ filters = {} }) => {

    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const filteredCustomers = customers.filter(customer => {

  // 🔎 SEARCH
  if (filters.search) {
    const searchText = filters.search.toLowerCase()

    const fullName = customer.fullName?.toLowerCase() || ''
    const email = customer.email?.toLowerCase() || ''
    const phone = customer.phone?.toLowerCase() || ''

    if (
      !fullName.includes(searchText) &&
      !email.includes(searchText) &&
      !phone.includes(searchText)
    ) {
      return false
    }
  }if (filters.customerId) {
  if (String(customer.id) !== String(filters.customerId)) {
    return false
  }
}


  return true
})


    // --- SAYFALAMA STATE'LERİ ---
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8 // Her sayfada gösterilecek kart sayısı

    useEffect(() => { loadCustomers() }, [])

    const loadCustomers = async () => {
        try {
            const res = await customerService.list()
            const payload = res.data;
            const items = Array.isArray(payload) ? payload : (payload?.items || payload?.data || []);
            setCustomers(items)
        } catch (error) {
            console.error("Yükleme Hatası:", error)
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        // Fotoğraftaki eski kutu yerine bu modern modal açılacak
        Swal.fire({
            title: 'Müşteriyi Sil?',
            text: "Bu işlem geri alınamaz ve tüm veriler kaybolur!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E92B63', // Senin buton rengin
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Evet, Silinsin',
            cancelButtonText: 'Vazgeç',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-5 shadow-lg',
                confirmButton: 'rounded-pill px-4',
                cancelButton: 'rounded-pill px-4'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Silme isteğini gönderiyoruz
                    await customerService.delete(id);

                    // State'i güncelle (Listeden anında kalksın)
                    setCustomers(prev => prev.filter(c => c.id !== id));

                    // Başarı bildirimi
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Müşteri kaydı silindi.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        borderRadius: '20px'
                    });
                } catch (error) {
                    // Konsoldaki 400/500 hatalarını burada yakalıyoruz
                    console.error("Silme hatası:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata!',
                        text: 'Müşteri silinemedi. Sunucuyla bağlantı kurulamıyor.',
                        confirmButtonColor: '#E92B63'
                    });
                }
            }
        });
    };

    // --- SAYFALAMA MANTIĞI ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfa değişince yukarı kaydır
    };

    const getInitials = (name) => {
        if (!name) return "??"
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center p-5">
            <div className="spinner-grow" style={{ color: '#E92B63' }} role="status"></div>
        </div>
    )

    return (

        <div className="p-4 bg-transparent">
            {/* 1. Müşteri Kartları Listesi */}
            <div className="row g-4">
                {currentItems.length > 0 ? (
                    currentItems.map((c) => (
                        <div key={c.id || Math.random()} className="col-xxl-3 col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 customer-card-hover"
                                style={{
                                    borderRadius: '24px',
                                    borderLeft: `5px solid ${c.status === 'NEW' ? '#9FB8A0' : '#E92B63'}`
                                }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="avatar-text rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm"
                                            style={{ width: '50px', height: '50px', backgroundColor: 'rgba(233, 43, 99, 0.1)', color: '#E92B63' }}>
                                            {getInitials(c.fullName)}
                                        </div>

                                        {/* Sadece NEW yazısı yeşil (Adaçayı Yeşili) */}
                                        <span className="badge rounded-pill px-3 py-2 fw-bold"
                                            style={{
                                                backgroundColor: 'rgba(159, 184, 160, 0.15)',
                                                color: '#9FB8A0',
                                                fontSize: '10px'
                                            }}>
                                            {c.status === 'NEW' ? 'YENİ' : 'AKTİF'}
                                        </span>
                                    </div>

                                    <h5 className="fw-bold text-dark mb-1 text-truncate">{c.fullName || 'İsimsiz Müşteri'}</h5>
                                    <p className="text-muted small mb-4">Müşteri No: #{c.id?.toString().substring(0, 5) || '---'}</p>

                                    <div className="vstack gap-2 mb-4">
                                        <div className="d-flex align-items-center gap-3 text-muted small">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', backgroundColor: 'rgba(233, 43, 99, 0.05)' }}>
                                                <FiMail size={14} color="#E92B63" />
                                            </div>
                                            <span className="text-truncate">{c.email || 'Email yok'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3 text-muted small">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', backgroundColor: 'rgba(233, 43, 99, 0.05)' }}>
                                                <FiPhone size={14} color="#E92B63" />
                                            </div>
                                            <span>{c.phone || 'Telefon yok'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-top d-flex gap-2">
                                        <Link href={`/customers/view/${c.id}`}
                                            className="btn flex-grow-1 rounded-3 fw-bold small py-2 text-white shadow-sm"
                                            style={{ backgroundColor: '#9FB8A0', border: 'none' }}>
                                            DETAYLARI GÖR
                                        </Link>
                                        <Link href={`/customers/edit/${c.id}`} className="btn btn-light rounded-3 shadow-sm border px-3 d-flex align-items-center">
                                            <FiEdit3 size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(c.id)} className="btn btn-soft-danger rounded-3 shadow-sm px-3 d-flex align-items-center">
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center p-5 bg-white rounded-4 shadow-sm">
                        <div className="mb-3">
                            <FiUsers size={48} color="#E92B63" style={{ opacity: 0.3 }} />
                        </div>
                        <h5 className="fw-bold text-dark">Müşteri Bulunamadı</h5>
                    </div>
                )}
            </div>

            {/* 2. SAYFALAMA KONTROLLERİ */}
            {customers.length > itemsPerPage && (
                <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded-4 shadow-sm mt-5">
                    <div className="text-muted small">
                        Toplam <strong>{customers.length}</strong> kayıttan <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, customers.length)}</strong> arası gösteriliyor
                    </div>

                    <nav>
                        <ul className="pagination mb-0 gap-2">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link rounded-3 border-0 shadow-sm" onClick={() => paginate(currentPage - 1)}>
                                    <FiChevronLeft />
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button
                                        className="page-link rounded-3 border-0 shadow-sm px-3"
                                        onClick={() => paginate(i + 1)}
                                        style={{
                                            backgroundColor: currentPage === i + 1 ? '#9FB8A0' : '#f1f5f9',
                                            color: currentPage === i + 1 ? 'white' : '#64748b'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link rounded-3 border-0 shadow-sm" onClick={() => paginate(currentPage + 1)}>
                                    <FiChevronRight />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default CustomersTable;