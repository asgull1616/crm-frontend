"use client";
import React from "react";
import Link from "next/link";
import CardHeader from "@/components/shared/CardHeader";
import CircleProgress from "@/components/shared/CircleProgress";
import { teamMembersList } from "@/utils/fackData/teamMembersList";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";

const Progress = ({ footerShow, title, btnFooter }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  if (isRemoved) return null;

  return (
    <div className="col-xxl-4">
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
        <div className="card-body px-4 pb-4">
          {teamMembersList.slice(0, 4).map(({ id, name, position, progress, thumbnail, color }) => {
            return (
              <div
                key={id}
                className="d-flex align-items-center justify-content-between mb-3"
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  border: "1px solid rgba(15,23,42,0.06)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  {thumbnail ? (
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                      }}
                    >
                      <Image width={38} height={38} src={thumbnail} alt="img" className="img-fluid" />
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
                      {name.substring(0, 1)}
                    </div>
                  )}

                  <div style={{ lineHeight: 1.1 }}>
                    <Link
                      href="#"
                      style={{
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: 12,
                        color: "#0f172a",
                      }}
                    >
                      {name}
                    </Link>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{position}</div>
                  </div>
                </div>

                <div style={{ width: 46, height: 46, display: "grid", placeItems: "center" }}>
                  <CircleProgress value={progress} text_sym={"%"} path_width="6px" path_color={color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer variants */}
        {footerShow ? (
          <div
            className="bg-transparent border-0 py-3 px-4"
            style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
          >
            <Link
              href="#"
              style={{
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              30 DK ÖNCE GÜNCELLENDİ
            </Link>
          </div>
        ) : null}

        {btnFooter ? (
          <div
            className="bg-transparent border-0 py-3 px-4"
            style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
          >
            <Link href="#" className="btn btn-primary" style={{ borderRadius: "12px" }}>
              Generate Report
            </Link>
          </div>
        ) : null}

        <CardLoader refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default Progress;
