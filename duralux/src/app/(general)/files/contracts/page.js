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
  const [mode, setMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);

  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customerId: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    file: null,
    existingFileName: "",
    existingFileUrl: "",
  });

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contractService.getAll(1, 50);

      setContracts(
        (res.data || []).map((x) => ({
          id: x.id,
          title: x.title,
          status: x.status === "ACTIVE" ? "AKTİF" : "PASİF",
          date: new Date(x.createdAt).toLocaleDateString("tr-TR"),
          fileUrl: x.fileUrl,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
    customerService.list().then((res) => setCustomers(res.data?.data || []));
  }, [fetchContracts]);

  const openForm = async (item = null, targetMode = "create") => {
    setMode(targetMode);
    if (item) {
      const res = await contractService.getById(item.id);
      const d = res?.data?.data ?? res?.data; // ✅ bazen direkt res.data gelir
if (!d) {
  console.error("contract getById response unexpected:", res?.data);
  alert("Sözleşme detayı alınamadı.");
  return;
}

      setFormData({
        title: d.title,
        description: d.description || "",
        customerId: d.customerId,
        startDate: d.startDate?.slice(0, 10) || "",
        endDate: d.endDate?.slice(0, 10) || "",
        status: d.status,
        file: null,
        existingFileName: d.fileName,
        existingFileUrl: d.fileUrl,
      });
      setSelectedId(item.id);
    } else {
      setFormData({
        title: "",
        description: "",
        customerId: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        file: null,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => v && fd.append(k, v));
        await contractService.create(fd);
      } else {
        await contractService.update(selectedId, formData);
      }
      setIsOpen(false);
      fetchContracts();
    } catch (err) {
      alert("Hata oluştu");
    }
  };

  const handleDelete = async (id) => {
    await contractService.delete(id);
    fetchContracts();
  };

  return (
    <>
      <PageHeader />
      <div className="contracts-wrapper">
        <div className="contracts-header">
          <h2>Sözleşmeler</h2>
          <button className="btn-gradient" onClick={() => openForm()}>
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
                onOpenView={(i) => openForm(i, "view")}
                onOpenEdit={(i) => openForm(i, "edit")}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ContractModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
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
