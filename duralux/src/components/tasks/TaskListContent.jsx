'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { taskService } from '@/lib/services/task.service'
import TasksDetails from './TasksDetails' // Bileşeni import ettiğinden emin ol

// Yardımcı fonksiyonlar bileşen dışında kalabilir
const statusColors = {
  NEW: 'secondary',
  IN_PROGRESS: 'primary',
  ON_HOLD: 'warning',
  COMPLETED: 'success',
}

const statusOptions = ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED']

const toInputDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const TaskListContent = () => {
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ GÖRÜNTÜLEME MODALI STATE'LERİ (Doğru yer burası)
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // ✅ GÜNCELLEME MODALI STATE'LERİ
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    title: '',
    status: 'NEW',
    startDate: '',
    endDate: '',
  })

  const fetchTasks = async () => {
    try {
      const res = await taskService.list()
      setTasks(res.data.data ?? [])
    } catch (e) {
      console.error(e)
      alert('Görevler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // ✅ GÖRÜNTÜLEME FONKSİYONU
  const openView = (task) => {
    setSelectedTask(task);
    setIsViewOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Görev silinsin mi?')) return
    try {
      await taskService.delete(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
      alert('Silme işlemi başarısız')
    }
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setEditForm({
      title: task.title ?? '',
      status: task.status ?? 'NEW',
      startDate: toInputDate(task.startDate),
      endDate: toInputDate(task.endDate),
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingTask?.id) return
    if (!editForm.title?.trim()) {
      alert('Başlık boş olamaz')
      return
    }
    if (editForm.startDate && editForm.endDate && editForm.endDate < editForm.startDate) {
      alert('Bitiş tarihi başlangıçtan önce olamaz')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: editForm.title,
        status: editForm.status,
        startDate: editForm.startDate || null,
        endDate: editForm.endDate || null,
      }

      const res = await taskService.update(editingTask.id, payload)
      const updatedTask = res?.data

      if (updatedTask?.id) {
        setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)))
      } else {
        await fetchTasks()
      }

      setShowEditModal(false)
      setEditingTask(null)
    } catch (e) {
      console.error(e)
      alert('Güncelleme işlemi başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="col-12">Yükleniyor...</div>
  }

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Görevler</h5>
          <button
  className="btn btn-sm text-white" // btn-primary sildik, text-white ekledik
  style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Rengini verdik
  onClick={() => router.push('/projects/create')}
>
  + Yeni Görev
</button>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Durum</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th className="text-end">Aksiyon</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Henüz görev yok
                  </td>
                </tr>
              )}

              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <span className={`badge bg-${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {task.endDate ? new Date(task.endDate).toLocaleDateString() : '-'}
                  </td>

                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      {/* ✅ VIEW (GÖRÜNTÜLE) BUTONU */}
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => openView(task)}
                      >
                        Görüntüle
                      </button>

                      {/* ✅ UPDATE */}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(task)}
                      >
                        Güncelle
                      </button>

                      {/* ✅ DELETE */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(task.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ GÖRÜNTÜLEME MODALI (Offcanvas) */}
      {isViewOpen && (
        <TasksDetails 
          task={selectedTask} 
          onClose={() => setIsViewOpen(false)} 
        />
      )}

      {/* ✅ GÜNCELLEME MODALI */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,.5)' }}
          onClick={() => !saving && setShowEditModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Görev Güncelle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !saving && setShowEditModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Başlık</label>
                  <input
                    className="form-control"
                    value={editForm.title}
                    onChange={(e) => setEditForm(s => ({ ...s, title: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Durum</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm(s => ({ ...s, status: e.target.value }))}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Başlangıç</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm(s => ({ ...s, startDate: e.target.value }))}
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label className="form-label">Bitiş</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm(s => ({ ...s, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => !saving && setShowEditModal(false)}
                  disabled={saving}
                >
                  İptal
                </button>
               <button
  className="btn text-white" // btn-primary sildik, text-white ekledik
  style={{ backgroundColor: '#E92B63', borderColor: '#E92B63' }} // Rengini verdik
  onClick={handleUpdate}
  disabled={saving}
>
  {saving ? 'Kaydediliyor...' : 'Kaydet'}
</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskListContent