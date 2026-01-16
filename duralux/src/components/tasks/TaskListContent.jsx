'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { taskService } from '@/lib/services/task.service'

const statusColors = {
  NEW: 'secondary',
  IN_PROGRESS: 'primary',
  ON_HOLD: 'warning',
  COMPLETED: 'success',
}

const TaskListContent = () => {
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="col-12">Yükleniyor...</div>
  }

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Görevler</h5>
          <button
            className="btn btn-sm btn-primary"
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
                    {task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : '-'}
                  </td>

                  <td>
                    {task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : '-'}
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default TaskListContent
