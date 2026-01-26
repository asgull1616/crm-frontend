"use client";
import React, { useEffect, useState } from "react";
import { FiMoreVertical, FiPlus, FiShare2 } from "react-icons/fi";
import getIcon from "@/utils/getIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";

const TaskViewHeader = ({ taskId }) => {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("Görev Detayı");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!taskId) return;
      try {
        const res = await taskService.findOne(taskId);
        const t = res?.data?.data ?? res?.data;
        if (mounted && t?.title) setTaskTitle(t.title);
      } catch (err) {
        console.error("Yükleme hatası:", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [taskId]);

  const handleDelete = async () => {
    if (!confirm("Görevi silmek istediğinize emin misiniz?")) return;
    try {
      await taskService.delete(taskId);
      router.push("/tasks/list");
    } catch (e) {
      alert("Silme işlemi başarısız");
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <div className="me-auto">
        <h4 className="mb-0 fw-bold text-truncate" style={{ maxWidth: 520 }}>
          {taskTitle}
        </h4>
      </div>

      {/* Üç Nokta Menüsü */}
      <div className="dropdown">
        <button className="btn btn-icon btn-light-brand" data-bs-toggle="dropdown">
          <FiMoreVertical />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <Link className="dropdown-item d-flex align-items-center" href={`/tasks/edit/${taskId}`}>
              <i className="me-3">{getIcon("feather-edit")}</i>
              <span>Görevi Düzenle</span>
            </Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger d-flex align-items-center" onClick={handleDelete}>
              <i className="me-3">{getIcon("feather-trash-2")}</i>
              <span>Görevi Sil</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Görev Oluştur Butonu */}
      <Link href="/tasks/create" className="btn text-white" style={{ backgroundColor: "#E92B63" }}>
        <FiPlus size={16} className="me-2" />
        <span>Görev Oluştur</span>
      </Link>
    </div>
  );
};

export default TaskViewHeader;