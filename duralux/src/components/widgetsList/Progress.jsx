"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardHeader from "@/components/shared/CardHeader";
import CircleProgress from "@/components/shared/CircleProgress";
import CardLoader from "@/components/shared/CardLoader";
import useCardTitleActions from "@/hooks/useCardTitleActions";
import Image from "next/image";
import { taskService } from "@/lib/services/task.service";

const Progress = ({ footerShow, title, btnFooter }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } =
    useCardTitleActions();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isRemoved) return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await taskService.teamProgress({ limit: 4 });
        const data = res?.data ?? {};
        setMembers(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        console.log("teamProgress error:", e);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [refreshKey, isRemoved]);

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
          {members.slice(0, 4).map(({ id, name, position, progress, thumbnail, color }) => {
            const safeName = name || "—";
            const initial = safeName?.trim?.()?.substring?.(0, 1) || "M";
            const hasThumb = typeof thumbnail === "string" ? thumbnail.trim().length > 0 : !!thumbnail;

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
                  {hasThumb ? (
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
                      {initial}
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
                      {safeName}
                    </Link>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                      {position || "—"}
                    </div>
                  </div>
                </div>

                <div style={{ width: 46, height: 46, display: "grid", placeItems: "center" }}>
                  <CircleProgress
                    value={Number.isFinite(progress) ? progress : 0}
                    text_sym={"%"}
                    path_width="6px"
                    path_color={color}
                  />
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

        {/* Loader */}
        <CardLoader refreshKey={refreshKey || loading} />
      </div>
    </div>
  );
};

export default Progress;
