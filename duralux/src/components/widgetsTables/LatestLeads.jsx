"use client";
import React from "react";
import Link from "next/link";
import CardHeader from "@/components/shared/CardHeader";
import Pagination from "@/components/shared/Pagination";
import { userList } from "@/utils/fackData/userList";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";

const LatestLeads = ({ title }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

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
          <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
        </div>

        {/* Body */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr className="text-muted text-uppercase fw-bold">
                  <th className="ps-4 py-3 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Müşteri
                  </th>
                  <th className="py-3 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Teklif
                  </th>
                  <th className="py-3 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Tarih
                  </th>
                  <th className="py-3 border-0" style={{ fontSize: "10px", letterSpacing: "0.6px" }}>
                    Durum
                  </th>
                </tr>
              </thead>

              <tbody>
                {userList(0, 5).map(
                  ({ date, id, proposal, user_email, user_img, user_name, user_status, color }) => (
                    <tr key={id} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          {user_img ? (
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 12,
                                overflow: "hidden",
                                boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                              }}
                            >
                              <Image
                                width={38}
                                height={38}
                                sizes="100vw"
                                src={user_img}
                                alt="user-img"
                                className="img-fluid"
                              />
                            </div>
                          ) : (
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
                              {user_name.substring(0, 1)}
                            </div>
                          )}

                          {/* Link aynı kalsın ama default mavi underline olmasın */}
                          <a href="#" style={{ textDecoration: "none" }}>
                            <span className="d-block fw-bold" style={{ fontSize: 12, color: "#0f172a" }}>
                              {user_name}
                            </span>
                            <span className="d-block fw-normal" style={{ fontSize: 11, color: "#94a3b8" }}>
                              {user_email}
                            </span>
                          </a>
                        </div>
                      </td>

                      <td className="py-3">
                        <span
                          className="badge rounded-pill fw-bold"
                          style={{
                            fontSize: "10px",
                            padding: "8px 12px",
                            backgroundColor: "#e2e8f0",
                            color: "#0f172a",
                            border: "1px solid rgba(0,0,0,0.03)",
                          }}
                        >
                          {proposal}
                        </span>
                      </td>

                      <td className="py-3" style={{ fontSize: 11, color: "#64748b" }}>
                        {date}
                      </td>

                      <td className="py-3">
                        {/* mevcut crm-badge sistemin varsa bozmadan kalsın; yoksa da inline güvenli */}
                        <span
                          className={`crm-badge bg-soft-${color} text-${color}`}
                          style={{
                            fontSize: "10px",
                            padding: "8px 12px",
                            borderRadius: 999,
                            fontWeight: 700,
                            border: "1px solid rgba(0,0,0,0.03)",
                            display: "inline-block",
                          }}
                        >
                          {user_status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-transparent border-0 py-3 px-4">
          <Pagination />
        </div>

        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default LatestLeads;
