"use client";

import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiTrash2,
  FiEdit3,
  FiMail,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { customerService } from "@/lib/services/customer.service";
import Swal from "sweetalert2";

const CustomersTable = ({ filters = {} }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const itemsPerPage = 8;

  // 🔎 Parent'tan gelen search için debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((filters.search || "").trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // 📡 Backend'den veri çek
  useEffect(() => {
    loadCustomers();
  }, [debouncedSearch, currentPage]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.list({
        search: debouncedSearch || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      setCustomers(res.data.data);
      setTotal(res.data.meta.total);
    } catch (error) {
      console.error("Listeleme hatası:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Silme
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Müşteriyi Sil?",
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E92B63",
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    try {
      await customerService.delete(id);

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setTotal((prev) => prev - 1);

      // Eğer son kaydı sildiysen sayfayı düşür
      if (total - 1 <= (currentPage - 1) * itemsPerPage) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }

      Swal.fire({
        icon: "success",
        title: "Silindi",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Silme başarısız",
      });
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-grow" style={{ color: "#E92B63" }} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Kartlar */}
      <div className="row g-4">
        {customers.length > 0 ? (
          customers.map((c) => (
            <div key={c.id} className="col-xxl-3 col-lg-4 col-md-6">
              <div
                className="card shadow-sm h-100"
                style={{
                  borderRadius: "24px",
                  borderLeft: `5px solid ${
                    c.status === "NEW" ? "#9FB8A0" : "#E92B63"
                  }`,
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-4">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: "rgba(233, 43, 99, 0.1)",
                        color: "#E92B63",
                      }}
                    >
                      {getInitials(c.fullName)}
                    </div>

                    <span className="badge bg-light text-dark">
                      {c.status === "NEW" ? "YENİ" : "AKTİF"}
                    </span>
                  </div>

                  <h5>{c.fullName || "İsimsiz Müşteri"}</h5>
                  <p className="text-muted small">#{c.id?.substring(0, 6)}</p>

                  <div className="mb-3 small text-muted">
                    <div>
                      <FiMail size={14} /> {c.email || "Email yok"}
                    </div>
                    <div>
                      <FiPhone size={14} /> {c.phone || "Telefon yok"}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      href={`/customers/view/${c.id}`}
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: "#9FB8A0" }}
                    >
                      Detay
                    </Link>

                    <Link
                      href={`/customers/edit/${c.id}`}
                      className="btn btn-sm btn-light"
                    >
                      <FiEdit3 />
                    </Link>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-5">
            <FiUsers size={48} style={{ opacity: 0.3 }} />
            <h5>Müşteri Bulunamadı</h5>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > itemsPerPage && (
        <div className="d-flex justify-content-between mt-5">
          <div className="small text-muted">
            Toplam <strong>{total}</strong> kayıttan{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -
              {Math.min(currentPage * itemsPerPage, total)}
            </strong>
          </div>

          <ul className="pagination mb-0 gap-2">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                <FiChevronLeft />
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                <FiChevronRight />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;
