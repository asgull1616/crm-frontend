"use client";
import React, { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import Link from "next/link";
import { activityService } from "@/lib/services/activity.service";
import ActivityCreateForm from "./ActivityCreateForm";
import { ActivityListItem } from "../widgetsList/ActivityTwo";
import ActivityDetailModal from "./ActivityDetailModal";

const ACTIVITY_UI = {
  CALL: { label: "Telefon görüşmesi", color: "primary" },
  EMAIL: { label: "E-posta", color: "info" },
  MEETING: { label: "Toplantı", color: "success" },
  NOTE: { label: "Not", color: "secondary" },

  TASK_CREATED: { label: "Görev oluşturuldu", color: "warning" },
  TASK_COMPLETED: { label: "Görev tamamlandı", color: "success" },

  CUSTOMER_CREATED: { label: "Müşteri oluşturuldu", color: "primary" },
  CUSTOMER_UPDATED: { label: "Müşteri güncellendi", color: "info" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TabActivityContent = ({ customerId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  useEffect(() => {
    if (customerId) loadActivities();
  }, [customerId]);

  const loadActivities = async () => {
    try {
      const res = await activityService.list({ customerId });
      setActivities(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-pane fade p-4" id="activityTab">
        <p className="text-muted">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="activityTab" role="tabpanel">
      {/* 🔹 ACTIVITY CREATE */}
      <ActivityCreateForm customerId={customerId} onCreated={loadActivities} />

      {/* 🔹 TIMELINE */}
      <div className="recent-activity p-4 pb-0">
        <div className="mb-4 d-flex justify-content-between">
          <h5 className="fw-bold">İşlem Geçmişi</h5>
        </div>

        {!activities.length && (
          <p className="text-muted">Bu müşteri için henüz aktivite yok.</p>
        )}

        <ul className="list-unstyled activity-feed">
          {activities.slice(0, limit).map((item) => {
            const ui = ACTIVITY_UI[item.type] || {
              label: item.type,
              color: "secondary",
            };

            const isSystem =
              item.type.startsWith("TASK_") ||
              item.type.startsWith("CUSTOMER_");

            return (
              <ActivityListItem
                key={item.id}
                date={formatDate(item.createdAt)}
                badge={ui.label}
                badgeColor={ui.color}
                isSystem={isSystem}
                onView={() => setSelectedActivityId(item.id)}
                text={
                  item.taskId ? (
                    <Link href={`/tasks/view/${item.taskId}`}>
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )
                }
              />
            );
          })}
        </ul>

        {activities.length > limit && (
          <button
            className="btn btn-link text-muted p-0 mt-2"
            onClick={() => setLimit((l) => l + 5)}
          >
            <FiMoreHorizontal className="me-1" />
            Daha fazla
          </button>
        )}
      </div>

      {/* 🔹 ACTIVITY DETAIL MODAL */}
      {selectedActivityId && (
        <ActivityDetailModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </div>
  );
};

export default TabActivityContent;
