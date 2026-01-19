'use client'
import React from 'react'

const TasksDetails = ({ task, onClose }) => {
  if (!task) return null

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const statusMap = {
    NEW: 'Yeni',
    IN_PROGRESS: 'Devam Ediyor',
    ON_HOLD: 'Beklemede',
    COMPLETED: 'Tamamlandı',
  }

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,.5)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">Görev Detayları</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY – SADECE ÜST KISIM */}
          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Başlık */}
              <div className="col-12">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Başlık
                </label>
                <div className="fs-16 fw-semibold p-2 bg-light rounded border">
                  {task.title || 'Belirtilmedi'}
                </div>
              </div>

              {/* Açıklama */}
              <div className="col-12">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Açıklama
                </label>
                <div
                  className="p-3 bg-light rounded border text-secondary"
                  style={{ minHeight: 100 }}
                >
                  {task.description || 'Açıklama girilmemiş.'}
                </div>
              </div>

              {/* Müşteri */}
              <div className="col-md-6">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Müşteri
                </label>
                <div className="p-2 bg-light rounded border">
                  {task.customer?.name || task.customerName || 'Seçilmedi'}
                </div>
              </div>

              {/* Durum */}
              <div className="col-md-6">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Durum
                </label>
                <div>
                  <span className="badge bg-primary p-2 px-3">
                    {statusMap[task.status] || task.status}
                  </span>
                </div>
              </div>

              {/* Başlangıç */}
              <div className="col-md-6">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Başlangıç Tarihi
                </label>
                <div className="p-2 bg-light rounded border">
                  {formatDate(task.startDate)}
                </div>
              </div>

              {/* Bitiş */}
              <div className="col-md-6">
                <label className="text-muted fs-12 text-uppercase fw-bold mb-1">
                  Bitiş Tarihi
                </label>
                <div className="p-2 bg-light rounded border">
                  {formatDate(task.endDate)}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer bg-light border-0">
            <button className="btn btn-secondary px-4" onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TasksDetails
