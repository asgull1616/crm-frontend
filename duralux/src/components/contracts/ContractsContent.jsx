"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import ContractCard from "@/components/contracts/ContractCard";
import ContractModal from "@/components/contracts/ContractModal";
import { API_BASE, formatTrDate, toUiStatus } from "@/components/contracts/contracts.helpers";

export default function ContractsContent() {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("create"); // create | view | edit
  const [selectedId, setSelectedId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const fileRef = useRef(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }, []);

  const authHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const authOnlyHeaders = useMemo(() => {
    const h = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  /* ================= LIST ================= */

  const fetchContracts = useCallback(async () => {
    setLoading(true);

    const url = `${API_BASE}/api/files/contracts?page=1&limit=50&_t=${Date.now()}`;

    const res = await fetch(url, {
      headers: authHeaders,
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const items = (json?.data || []).map((x) => ({
        id: x.id,
        title: x.title,
        date: formatTrDate(x.createdAt),
        status: toUiStatus(x.status),
        fileUrl: x.fileUrl || null,
      }));
      setContracts(items);
    } else {
      console.error("fetchContracts failed:", res.status);
    }

    setLoading(false);
  }, [authHeaders]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  /* ================= CUSTOMERS ================= */

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(`${API_BASE}/api/customers?_t=${Date.now()}`, {
        headers: authHeaders,
        cache: "no-store",
      });

      if (!res.ok) return;

      const json = await res.json();
      setCustomers(json?.data || []);
    };

    fetchCustomers();
  }, [authHeaders]);

  /* ================= DETAIL ================= */

  const fetchDetail = async (id) => {
    const res = await fetch(`${API_BASE}/api/files/contracts/${id}?_t=${Date.now()}`, {
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json;
  };

  const fillForm = (data) => {
    setNewTitle(data.title || "");
    setNewDesc(data.description || "");
    setSelectedCustomer(data.customerId || data.customer?.id || "");
    setStartDate(data.startDate?.slice(0, 10) || "");
    setEndDate(data.endDate?.slice(0, 10) || "");
    setStatus(data.status || "ACTIVE");
    setNewFile(null);

    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setSelectedCustomer("");
    setStartDate("");
    setEndDate("");
    setStatus("ACTIVE");
    setNewFile(null);
    setSelectedId(null);

    if (fileRef.current) fileRef.current.value = "";
  };

  const openCreate = () => {
    resetForm();
    setMode("create");
    setIsOpen(true);
  };

  const openView = async (item) => {
    const detail = await fetchDetail(item.id);
    if (!detail) return;

    fillForm(detail);
    setSelectedId(item.id);
    setMode("view");
    setIsOpen(true);
  };

  const openEdit = async (item) => {
    const detail = await fetchDetail(item.id);
    if (!detail) return;

    fillForm(detail);
    setSelectedId(item.id);
    setMode("edit");
    setIsOpen(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const normalizedStatus = status === "ACTIVE" ? "ACTIVE" : "INACTIVE";

    const fd = new FormData();
    fd.append("title", newTitle);
    fd.append("status", normalizedStatus);

    if (newDesc) fd.append("description", newDesc);
    if (selectedCustomer) fd.append("customerId", selectedCustomer);
    if (startDate) fd.append("startDate", startDate);
    if (endDate) fd.append("endDate", endDate);

    const fileToSend = newFile || fileRef.current?.files?.[0];
    if (fileToSend) fd.append("file", fileToSend);

    let res;

    if (mode === "create") {
      res = await fetch(`${API_BASE}/api/files/contracts`, {
        method: "POST",
        headers: authOnlyHeaders,
        body: fd,
      });
    }

    if (mode === "edit" && selectedId) {
      res = await fetch(`${API_BASE}/api/files/contracts/${selectedId}`, {
        method: "PATCH",
        headers: authOnlyHeaders,
        body: fd,
      });
    }

    if (!res || !res.ok) {
      const txt = res ? await res.text().catch(() => "") : "";
      console.error("save failed:", res?.status, txt);
      alert(`Kaydetme başarısız! (${res?.status || "no response"})`);
      return;
    }

    if (mode === "edit" && selectedId) {
      setContracts((prev) => prev.map((c) => (c.id === selectedId ? { ...c, title: newTitle } : c)));
    }

    await fetchContracts();
    setIsOpen(false);
    resetForm();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/api/files/contracts/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      alert("Silme başarısız!");
      return;
    }

    await fetchContracts();
  };

  /* ================= RENDER ================= */

  return (
    <div className="contracts-wrapper">
      {/* sadece bu sayfaya özel layout fix */}
      <style jsx>{`
        .contract-card .card-footer {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          align-items: stretch;
        }
        .contract-card .card-footer .btn-soft,
        .contract-card .card-footer .btn-danger-soft {
          width: 100%;
          justify-content: center;
        }
        .contract-card .card-body h3 {
          word-break: break-word;
        }
      `}</style>

      <div className="contracts-header">
        <div>
          <h2>Sözleşmeler</h2>
          <p>Proje ile ilgili hukuki belgeler</p>
        </div>
        <button className="btn-gradient" onClick={openCreate}>
          + Yeni Dosya
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}

      <div className="contracts-grid">
        {contracts.map((item) => (
          <ContractCard
            key={item.id}
            item={item}
            onView={() => openView(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {isOpen && (
        <ContractModal
          mode={mode}
          customers={customers}
          values={{
            newTitle,
            newDesc,
            newFile,
            selectedCustomer,
            startDate,
            endDate,
            status,
          }}
          setters={{
            setNewTitle,
            setNewDesc,
            setNewFile,
            setSelectedCustomer,
            setStartDate,
            setEndDate,
            setStatus,
          }}
          fileRef={fileRef}
          onClose={() => {
            setIsOpen(false);
            resetForm();
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
