"use client";
import React, { useEffect, useState } from "react";
import { FiMoreVertical, FiPlus, FiShare2 } from "react-icons/fi";
import getIcon from "@/utils/getIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { taskService } from "@/lib/services/task.service";

const socialLinkOptions = [
  { label: "Bağlantıyı Kopyala", icon: "feather-link", shareCount: "" },
  { label: "E-posta ile Gönder", icon: "feather-mail", shareCount: "" },
];

const moreOptions = [
  { label: "Görevi Düzenle", icon: "feather-edit", action: "edit" },
  { type: "divider" },
  { label: "Görevi Sil", icon: "feather-trash-2", action: "delete" },
];

const TaskViewHeader = ({ taskId }) => {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("Görev Detayı");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await taskService.findOne(taskId);
        const t = res?.data?.data ?? res?.data;
        if (mounted && t?.title) setTaskTitle(t.title);
      } catch {
        // sessiz geç
      }
    };

    if (taskId) load();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const handleAction = async (action) => {
    if (action === "edit") {
      router.push(`/tasks/edit/${taskId}`);
      return;
    }

    if (action === "delete") {
      if (!confirm("Görev silinsin mi?")) return;
      try {
        await taskService.delete(taskId);
        router.push("/tasks/list");
      } catch (e) {
        console.error(e);
        alert("Silme işlemi başarısız");
      }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Bağlantı kopyalandı");
    } catch {
      alert("Bağlantı kopyalanamadı");
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <div className="me-auto">
        <div className="d-flex align-items-center gap-2">
          <h4 className="mb-0 fw-bold text-truncate" style={{ maxWidth: 520 }}>
            {taskTitle}
          </h4>
        </div>
      </div>

      <div className="filter-dropdown">
        <a
          className="btn btn-icon btn-light-brand"
          data-bs-toggle="dropdown"
          data-bs-offset="0, 10"
          data-bs-auto-close="outside"
        >
          <i className="lh-1">
            <FiMoreVertical />
          </i>
        </a>

        <div className="dropdown-menu dropdown-menu-end">
          {moreOptions.map(({ icon, label, type, action }, index) => {
            if (type === "divider")
              return <li key={index} className="dropdown-divider"></li>;
            return (
              <li key={index}>
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAction(action);
                  }}
                >
                  <i className="me-3">{getIcon(icon)}</i>
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </div>
      </div>

   <Link
  href="/tasks/create"
  className="btn text-white"
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
  }}
>
  <FiPlus size={16} className="me-2" />
  <span>Görev Oluştur</span>
</Link>

      <div className="filter-dropdown">
       <a
  href="#"
  className="btn text-white"
  data-bs-toggle="dropdown"
  data-bs-offset="0,11"
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
  }}
>
  <FiShare2 size={16} className="me-2" />
  <span>Görevi Paylaş</span>
</a>


        <ul className="dropdown-menu dropdown-menu-start">
          {socialLinkOptions.map(({ icon, label, shareCount, type }, index) => {
            if (type === "divider")
              return <li key={index} className="dropdown-divider"></li>;

            const onClick = (e) => {
              e.preventDefault();
              if (label === "Bağlantıyı Kopyala") copyLink();
              else alert("E-posta gönderme aksiyonu eklenmedi");
            };

            return (
              <li key={index}>
                <a href="#" className="dropdown-item" onClick={onClick}>
                  <i className="me-3">{getIcon(icon)}</i>
                  <span>{label}</span>
                  <span className="fs-10 text-gray-500 ms-2">
                    ({shareCount})
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TaskViewHeader;
