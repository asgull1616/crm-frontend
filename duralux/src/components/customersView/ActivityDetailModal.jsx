"use client";
import { useEffect, useState } from "react";
// Görsellik için ek ikonlar ekledim (FiCalendar, FiUser, FiBriefcase vb.)
import {
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import { activityService } from "@/lib/services/activity.service";
import Link from "next/link";
import Swal from 'sweetalert2';

const TYPE_UI = {
  CALL: { label: "📞 Telefon", color: "primary" },
  EMAIL: { label: "✉️ E-posta", color: "info" },
  MEETING: { label: "📅 Toplantı", color: "success" },
  NOTE: { label: "📝 Not", color: "secondary" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const ActivityDetailModal = ({ activityId, onClose, onDeleted, onUpdated }) => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (activityId) load();
  }, [activityId]);

  const load = async () => {
    try {
      const res = await activityService.getById(activityId);
      setActivity(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description || "");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Eski confirm kutusu yerine modern SweetAlert2
    Swal.fire({
        title: 'Aktivite Silinsin mi?',
        text: "Bu aktivite kaydı kalıcı olarak silinecektir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E92B63', // Sizin pembe buton renginiz
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Evet, Sil!',
        cancelButtonText: 'Vazgeç',
        background: '#ffffff',
        customClass: {
            popup: 'rounded-5 shadow-lg border-0',
            confirmButton: 'rounded-pill px-4 fw-bold',
            cancelButton: 'rounded-pill px-4 fw-bold'
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Silme isteğini gönderiyoruz
                await activityService.delete(activityId);
                
                // Başarı bildirimi
                Swal.fire({
                    title: 'Silindi!',
                    text: 'Aktivite başarıyla kaldırıldı.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    borderRadius: '25px'
                });

                // Modal'ı kapat ve listeyi yenile
                onDeleted?.();
                onClose();
            } catch (error) {
                console.error("Silme hatası:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Aktivite silinirken bir sorun oluştu.',
                    confirmButtonColor: '#E92B63'
                });
            }
        }
    });
};

  const handleUpdate = async () => {
    await activityService.update(activityId, {
      title,
      description,
    });
    setEditMode(false);
    onUpdated?.();
    load();
  };

  if (!activity) return null;

  const ui = TYPE_UI[activity.type] || {
    label: activity.type,
    color: "secondary",
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            {/* HEADER */}
            <div className="modal-header border-0 pb-0 pt-4 px-4 align-items-start">
              <div>
                <span
                  className={`badge rounded-pill bg-${ui.color} bg-opacity-10 text-${ui.color} px-3 py-2 mb-2 border border-${ui.color} border-opacity-25`}
                >
                  {ui.label}
                </span>
                <h5 className="modal-title fw-bold text-dark mt-1">
                  {editMode ? "Aktivite Düzenle" : "Aktivite Detayı"}
                </h5>
              </div>

              {/* ACTION BUTTONS */}
              <div className="d-flex gap-2">
                {!editMode && (
                  <>
                    <button
                      className="btn btn-light rounded-circle shadow-sm p-2 text-primary hover-scale"
                      onClick={() => setEditMode(true)}
                      title="Düzenle"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className="btn btn-light rounded-circle shadow-sm p-2 text-danger hover-scale"
                      onClick={handleDelete}
                      title="Sil"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </>
                )}
                <button
                  className="btn btn-light rounded-circle shadow-sm p-2"
                  onClick={onClose}
                  style={{ width: "40px", height: "40px" }}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="modal-body p-4">
              {/* Ana İçerik Alanı (Başlık & Açıklama) */}
              <div
                className={`rounded-3 p-4 mb-4 border transition-all ${editMode ? "bg-white border-primary shadow-sm" : "bg-light bg-opacity-50 border-light"}`}
              >
                {/* BAŞLIK */}
                <div className="mb-3">
                  <small
                    className="text-uppercase text-muted fw-bold d-block mb-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Başlık
                  </small>
                  {editMode ? (
                    <input
                      className="form-control form-control-lg border-0 bg-light shadow-none fw-bold text-dark"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Aktivite başlığı..."
                    />
                  ) : (
                    <h5 className="fw-bold text-dark mb-0">{activity.title}</h5>
                  )}
                </div>

                {/* AÇIKLAMA */}
                <div>
                  <small
                    className="text-uppercase text-muted fw-bold d-block mb-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Açıklama
                  </small>
                  {editMode ? (
                    <textarea
                      className="form-control border-0 bg-light shadow-none"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Bir açıklama girin..."
                      style={{ resize: "none" }}
                    />
                  ) : (
                    <p
                      className="text-secondary mb-0"
                      style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}
                    >
                      {activity.description || (
                        <span className="text-muted fst-italic">
                          Açıklama girilmemiş.
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* TARİH (Sadece okuma modunda şık durur) */}
                {!editMode && (
                  <div className="d-flex align-items-center mt-4 text-muted small fw-medium pt-3 border-top border-light">
                    <FiCalendar className="me-2" />
                    {formatDate(activity.createdAt)}
                  </div>
                )}
              </div>

              {/* İLİŞKİLER (GRID) - Edit Modunda da görünür kalabilir, referans için */}
              <div className="row g-3 mb-4">
                {activity.customer && (
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm bg-white">
                      <div className="card-body">
                        <FiUser className="text-primary mb-2" size={20} />
                        <small
                          className="text-uppercase text-muted fw-bold d-block mb-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Müşteri
                        </small>
                        <div className="fw-bold text-dark">
                          <Link
                            href={`/customers/view/${activity.customer.id}`}
                            className="text-decoration-none text-dark stretched-link"
                          >
                            {activity.customer.fullName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activity.task && (
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm bg-white">
                      <div className="card-body">
                        <FiBriefcase className="text-warning mb-2" size={20} />
                        <small
                          className="text-uppercase text-muted fw-bold d-block mb-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Bağlı Görev
                        </small>
                        <div className="fw-bold text-dark">
                          <Link
                            href={`/tasks/view/${activity.task.id}`}
                            className="text-decoration-none text-dark stretched-link"
                          >
                            {activity.task.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OLUŞTURAN BİLGİSİ */}
              {!editMode && activity.createdByUser && (
                <div className="d-flex align-items-center justify-content-end text-muted small">
                  <span className="me-2">Oluşturan:</span>
                  <span className="fw-bold text-dark">
                    {activity.createdByUser.username}
                  </span>
                </div>
              )}
            </div>

            {/* FOOTER - Sadece Edit Modundaysa Buton Göster, Değilse Footer'ı Gizle veya Kapat Butonu Koy */}
            {editMode && (
              <div className="modal-footer border-top-0 pt-0 pb-4 px-4 bg-transparent">
                <div className="d-flex w-100 gap-2">
                  <button
                    className="btn btn-light flex-grow-1 py-2 text-muted fw-medium border-0"
                    onClick={() => setEditMode(false)}
                  >
                    <FiX className="me-2" /> Vazgeç
                  </button>
                  <button
                    className="btn btn-primary flex-grow-1 py-2 shadow fw-bold"
                    onClick={handleUpdate}
                  >
                    <FiSave className="me-2" /> Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* View Modunda Footer yerine üstteki 'X' butonu yeterli, ama footer istenirse buraya eklenebilir. 
                Modern tasarımlarda view modunda footer pek kullanılmaz. */}
          </div>
        </div>
      </div>
      {/* Backdrop */}
    </>
  );
};

export default ActivityDetailModal;
