"use client";

import React, { useEffect, useMemo, useState } from "react";
import { programPlanService } from "@/lib/services/programPlan.service";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

function pad(n) {
    return String(n).padStart(2, "0");
}

function toYMD(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getMonthRange(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
}

export default function DashboardPlanCalendar({ title = "Plan Takvimi", userId }) {
    const [current, setCurrent] = useState(() => new Date());
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const { start, end } = useMemo(() => getMonthRange(current), [current]);

    const fetchCalendar = async () => {
        setLoading(true);
        try {
            const data = await programPlanApi.calendar({ start: toYMD(start), end: toYMD(end) });
            setItems(Array.isArray(data) ? data : []);

        } catch (e) {
            console.log(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, userId]);

    const monthLabel = useMemo(() => {
        const m = current.toLocaleString("tr-TR", { month: "long" });
        return `${m.charAt(0).toUpperCase() + m.slice(1)} ${current.getFullYear()}`;
    }, [current]);

    return (
        <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 className="mb-0">{title}</h5>
                            <small className="text-muted">Plan ekranına eklenen yapılacaklar burada görünür</small>
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                            <button
                                className="btn btn-light"
                                onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                            >
                                ←
                            </button>

                            <div style={{ fontWeight: 600 }}>{monthLabel}</div>

                            <button
                                className="btn btn-light"
                                onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-4 text-center text-muted">Yükleniyor...</div>
                    ) : items.length === 0 ? (
                        <div className="py-4 text-center text-muted">Bu aralıkta plan bulunamadı.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr className="text-muted">
                                        <th>Başlık</th>
                                        <th>Proje</th>
                                        <th>Aralık</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((p) => (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: 600 }}>{p.title}</td>
                                            <td className="text-muted">{p.projectName ?? "-"}</td>
                                            <td className="text-muted">
                                                {new Date(p.start).toLocaleDateString("tr-TR")} -{" "}
                                                {new Date(p.end).toLocaleDateString("tr-TR")}
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: 999,
                                                        background: PRIMARY_LIGHT,
                                                        color: PRIMARY,
                                                        fontWeight: 600,
                                                        display: "inline-block",
                                                        minWidth: 120,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {String(p.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                        Not: Bu liste, backend’de <code>/api/program/plan/calendar</code> endpoint’inden geliyor.
                    </div>
                </div>
            </div>
        </div>
    );
}
