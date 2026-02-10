"use client";
import { useState } from "react";
import { activityService } from "@/lib/services/activity.service";

const ACTIVITY_TYPES = [
  { value: "CALL", label: "📞 Telefon" },
  { value: "EMAIL", label: "✉️ E-posta" },
  { value: "MEETING", label: "📅 Toplantı" },
  { value: "NOTE", label: "📝 Not" },
];

const ActivityCreateForm = ({ customerId, onCreated }) => {
  const [type, setType] = useState("CALL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return alert("Başlık zorunlu");

    setLoading(true);
    try {
      await activityService.create({
        customerId,
        type,
        title,
        description,
      });
      setTitle("");
      setDescription("");
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h6 className="mb-0">Yeni Aktivite</h6>
      </div>
      <div className="card-body p-3">
        <div className="row g-2">
          <div className="col-md-3">
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Başlık (örn: Telefon görüşmesi yapıldı)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-12">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Açıklama (opsiyonel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-12 text-end">
            <button
              className="btn btn-sm text-white"
              disabled={loading}
              onClick={submit}
              style={{
                backgroundColor: "#E92B63",
                borderColor: "#E92B63",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Ekleniyor..." : "Aktivite Ekle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCreateForm;
