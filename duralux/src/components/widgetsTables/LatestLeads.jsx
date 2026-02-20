"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardHeader from "@/components/shared/CardHeader";
import Pagination from "@/components/shared/Pagination";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";
import { proposalService } from "@/lib/services/proposal.service";

const LatestLeads = ({ title }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    if (isRemoved) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);

        const res = await proposalService.list({
          page,
          limit,
          sortBy: "createdAt",
          order: "desc",
        });

        const data = res?.data ?? {};
        setRows(Array.isArray(data.items) ? data.items : []);
        setMeta(data.meta ?? null);
      } catch (e) {
        console.log("proposal list error:", e);
        setRows([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [page, refreshKey, isRemoved]);

  if (isRemoved) return null;

  return (
    <div className="col-xxl-8">
      <div
        className={`card border-0 shadow-sm ${isExpanded ? "card-expand" : ""} ${
          refreshKey ? "card-loading" : ""
        }`}
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        {/* Header */}
        <div className="px-4 pt-3">
          <CardHeader
            title={title}
            refresh={handleRefresh}
            remove={handleDelete}
            expanded={handleExpand}
          />
        </div>

        {/* Body */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr className="text-muted text-uppercase fw-bold">
                  <th className="ps-5 py-1 border-0" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                    Müşteri
                  </th>
                  <th className="ps-5 py-1 border-0" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                    Teklif
                  </th>
                  <th className="ps-5 py-1 border-0" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                    Tarih
                  </th>
                  <th className="ps-5 py-1 border-0" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                    Durum
                  </th>
                </tr>
              </thead>

              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="ps-4 py-4" style={{ fontSize: 12, color: "#64748b" }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => {
                    const safeName = p.customerName || "-";
                    const initial = safeName?.trim?.()?.substring?.(0, 1) || "M";

                    return (
                      <tr key={p.id} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {/* avatar yoksa initial */}
                            <div
                              className="d-flex align-items-center justify-content-center text-white"
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #94a3b8, #475569)",
                                boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                              }}
                            >
                              {initial}
                            </div>

                            <a href="#" style={{ textDecoration: "none" }}>
                              <span className="d-block fw-bold" style={{ fontSize: 12, color: "#0f172a" }}>
                                {safeName}
                              </span>
                              <span className="d-block fw-normal" style={{ fontSize: 11, color: "#94a3b8" }}>
                                {p.customerEmail ?? ""}
                              </span>
                            </a>
                          </div>
                        </td>

                        <td className="py-3">
                          <span
                            className="badge rounded-pill fw-bold"
                            style={{
                              fontSize: "10px",
                              padding: "8px 10px",
                              backgroundColor: "#e2e8f0",
                              color: "#d43e3eff",
                              border: "1px solid rgba(0,0,0,0.03)",
                            }}
                          >
                            {p.title ?? "Teklif"}
                          </span>
                        </td>

                        <td className="py-3" style={{ fontSize: 11, color: "#64748b" }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleString("tr-TR") : "-"}
                        </td>

                        <td className="py-3">
                          <span
                            className={`crm-badge bg-soft-primary text-primary`}
                            style={{
                              fontSize: "10px",
                              padding: "8px 12px",
                              borderRadius: 999,
                              fontWeight: 700,
                              border: "1px solid rgba(0,0,0,0.03)",
                              display: "inline-block",
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-transparent border-0 py-3 px-4">
          <Pagination
            page={page}
            totalPages={meta?.totalPages ?? 1}
            onChange={(p) => setPage(p)}
          />
        </div>

        <CardLoader refreshKey={refreshKey || loading} />
      </div>
    </div>
  );
};

export default LatestLeads;
