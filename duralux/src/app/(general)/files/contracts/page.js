"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { contractService } from "@/lib/services/contract.service";
import { customerService } from "@/lib/services/customer.service";
import ContractCard from "@/components/files/contracts/ContractCard";
import ContractModal from "@/components/files/contracts/ContractModal";

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit | view
  const [selectedId, setSelectedId] = useState(null);

  const fileInputRef = useRef(null);

  const emptyForm = {
    title: "",
    description: "",
    customerId: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    file: null,
    existingFileName: "",
    existingFileUrl: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ✅ sadece backend’in beklediği alanlarla FormData oluştur
  const buildFormData = (data) => {
    const fd = new FormData();

    if (data.title) fd.append("title", data.title);
    if (data.description) fd.append("description", data.description);
    if (data.customerId) fd.append("customerId", data.customerId);
    if (data.startDate) fd.append("startDate", data.startDate);
    if (data.endDate) fd.append("endDate", data.endDate);
    if (data.status) fd.append("status", data.status);

    // ✅ file (sadece yeni seçildiyse)
    if (data.file) fd.append("file", data.file);

    return fd;
  };

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contractService.getAll(1, 50);

      const list = (res.data || []).map((x) => ({
        id: x.id,
        title: x.title,
        status: x.status === "ACTIVE" ? "AKTİF" : "PASİF",
        date: x.createdAt
          ? new Date(x.createdAt).toLocaleDateString("tr-TR")
          : "-",
        fileUrl: x.fileUrl,
      }));

      setContracts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
    customerService
      .list()
      .then((res) => setCustomers(res.data?.data || []))
      .catch(() => setCustomers([]));
  }, [fetchContracts]);

  const openForm = async (item = null, targetMode = "create") => {
  console.log("openForm clicked:", item?.id, targetMode);

  setMode(targetMode);
  if (fileInputRef.current) fileInputRef.current.value = "";

  // modalı hemen aç
  setIsOpen(true);

  try {
    if (!item?.id) {
      setSelectedId(null);
      setFormData(emptyForm);
      return;
    }

    setSelectedId(item.id);

    const res = await contractService.getById(item.id);
    console.log("getById RES:", res);

    const d = res?.id ? res : (res?.data ?? res);
    console.log("picked d:", d);

    if (!d || !d.id) {
      alert("Detay payload boş geliyor. Network/console kontrol et.");
      return;
    }

    setFormData({
      title: d.title ?? "",
      description: d.description ?? "",
      customerId: d.customerId ?? "",
      startDate: d.startDate ? String(d.startDate).slice(0, 10) : "",
      endDate: d.endDate ? String(d.endDate).slice(0, 10) : "",
      status: d.status ?? "ACTIVE",
      file: null,
      existingFileName: d.fileName ?? d.originalFileName ?? "",
      existingFileUrl: d.fileUrl ?? "",
    });
  } catch (e) {
    console.error("getById failed:", e);
    alert("getById hata verdi. Network'te 401/403/404 var mı bak.");
  }
};

  const handleCloseModal = () => {
    // ✅ modal kapanınca file input temizle
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const fd = buildFormData(formData);

      if (mode === "create") {
        await contractService.create(fd);
      } else {
        // ✅ update de multipart olmalı (dosya güncellemesi buradan çalışır)
        await contractService.update(selectedId, fd);
      }

      // ✅ UI reset
      setIsOpen(false);
      setSelectedId(null);
      setFormData(emptyForm);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await fetchContracts();
    } catch (err) {
  console.log("STATUS:", err?.response?.status);
  console.log("DATA:", err?.response?.data);   // ✅ asıl sebep burada
  console.log("HEADERS:", err?.response?.headers);
  console.error(err);
  alert("Hata oluştu");
}
  };

  const handleDelete = async (id) => {
    try {
      await contractService.delete(id);
      await fetchContracts();
    } catch (err) {
      console.error(err);
      alert("Silme sırasında hata oluştu");
    }
  };

  return (
    <>
      <PageHeader />

      <div className="contracts-wrapper">
        <div className="contracts-header">
          <h2>Sözleşmeler</h2>
          <button
            className="btn-gradient"
            onClick={() => openForm(null, "create")}
          >
            + Yeni Dosya
          </button>
        </div>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="contracts-grid">
            {contracts.map((item) => (
              <ContractCard
                key={item.id}
                item={item}
                onOpenView={() => openForm(item, "view")}
                onOpenEdit={() => openForm(item, "edit")}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ContractModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          mode={mode}
          customers={customers}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          fileInputRef={fileInputRef}
        />
      </div>

      <style jsx global>{`
        /* Senin CSS kodların buraya */
      `}</style>
    </>
  );
}