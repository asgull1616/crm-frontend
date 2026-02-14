"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ContractCard from "@/components/contracts/ContractCard";
import ContractModal from "@/components/contracts/ContractModal";
import { formatTrDate, toUiStatus } from "@/components/contracts/contracts.helpers";

// ✅ servisler
import { contractsService } from "@/lib/services/contracts.service";
import { customerService } from "@/lib/services/customer.service"; // sende yolu farklıysa düzelt

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

  const resetFileInput = () => {
    setNewFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ================= LIST ================= */

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contractsService.list({
        page: 1,
        limit: 50,
        _t: Date.now(), // cache bust
      });

      const data = res?.data?.data || [];
      const items = data.map((x) => ({
        id: x.id,
        title: x.title,
        date: formatTrDate(x.createdAt),
        status: toUiStatus(x.status),
        fileUrl: x.fileUrl || null,
      }));

      setContracts(items);
    } catch (e) {
      console.error("fetchContracts failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  /* ================= CUSTOMERS ================= */

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerService.list({ _t: Date.now() });
        setCustomers(res?.data?.data || []);
      } catch (e) {
        console.error("fetchCustomers failed:", e);
      }
    };

    fetchCustomers();
  }, []);

  /* ================= DETAIL ================= */

  const fetchDetail = async (id) => {
    try {
      const res = await contractsService.getById(id);
      return res?.data?.data || res?.data || null;
    } catch (e) {
      console.error("fetchDetail failed:", e);
      return null;
    }
  };

  const fillForm = (data) => {
    setNewTitle(data?.title || "");
    setNewDesc(data?.description || "");
    setSelectedCustomer(data?.customerId || data?.customer?.id || "");
    setStartDate(data?.startDate?.slice(0, 10) || "");
    setEndDate(data?.endDate?.slice(0, 10) || "");
    setStatus(data?.status || "ACTIVE");
    resetFileInput();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setSelectedCustomer("");
    setStartDate("");
    setEndDate("");
    setStatus("ACTIVE");
    setSelectedId(null);
    resetFileInput();
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

    // ✅ LOG BURADA (API çağrısından ÖNCE)
    console.log("newFile state (before):", newFile);
    console.log("fileRef.current?.files?.[0] (before):", fileRef.current?.files?.[0]);

    const fileToSend = newFile || fileRef.current?.files?.[0] || null;

    console.log("fileToSend (before):", fileToSend);
    console.log("is File? (before):", fileToSend instanceof File);

    const payload = {
      title: newTitle,
      status: normalizedStatus,
      description: newDesc || undefined,
      customerId: selectedCustomer || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      if (mode === "create") {
        await contractsService.create(payload, fileToSend);
      }

      if (mode === "edit" && selectedId) {
        await contractsService.update(selectedId, payload, fileToSend);
      }

      await fetchContracts();
      setIsOpen(false);
      resetForm();
    } catch (e) {
      console.error("save failed:", e);
      alert("Kaydetme başarısız!");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    try {
      await contractsService.delete(id);
      await fetchContracts();
    } catch (e) {
      console.error("delete failed:", e);
      alert("Silme başarısız!");
    }
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

        /* ✅ taşma/kayma fix */
        .contract-card .card-footer :global(button) {
          width: 100%;
          min-width: 0;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
