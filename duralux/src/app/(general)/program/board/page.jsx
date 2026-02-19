"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PageHeader from "@/components/shared/pageHeader/PageHeader";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  createColumn,
  updateColumn,
  deleteColumn,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  moveColumn,
  getUsers,
} from "@/lib/services/programBoard.service";

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

/* -------------------- Modal -------------------- */
function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div style={modalOverlay} onMouseDown={onClose}>
      <div style={modalCard} onMouseDown={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={modalDot} />
            <div style={{ fontWeight: 500, fontSize: 18 }}>{title}</div>
          </div>
          <button onClick={onClose} style={xBtn} aria-label="Kapat">
            ✕
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        {footer ? <div style={modalFooter}>{footer}</div> : null}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#344054" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

/* -------------------- UI bits -------------------- */
function Avatar({ name }) {
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div
      title={name}
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        background: PRIMARY_LIGHT,
        color: PRIMARY,
        display: "grid",
        placeItems: "center",
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid rgba(233,43,99,0.2)",
        flexShrink: 0,
      }}
    >
      {initials || "?"}
    </div>
  );
}

function Card({ card, onEdit, onDelete, overlay = false }) {
  return (
    <div
      style={{
        border: "1px solid #f2f2f2",
        borderRadius: 18,
        padding: 16,
        background: "#fff",
        boxShadow: overlay
          ? "0 20px 60px rgba(0,0,0,0.2)"
          : "0 12px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 500,
              fontSize: 18,
              color: "#111",
              lineHeight: 1.3,
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar name={card.assignee || "Atanmadı"} />
            <div style={{ fontSize: 15, fontWeight: 500, color: "#667085" }}>
              {card.assignee || "Atanan yok"}
            </div>
          </div>
        </div>

        {!overlay && (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => onEdit(card)} style={btnGhost}>
              Düzenle
            </button>
            <button onClick={() => onDelete(card)} style={btnDanger}>
              Sil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableCard({ card, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card card={card} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function SortableColumn({
  column,
  cards,
  onAddCard,
  onRenameColumn,
  onDeleteColumn,
  onEditCard,
  onDeleteCard,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: 360,
    maxWidth: 360,
    background: "#fff",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 16px 45px rgba(0,0,0,0.08)",
    border: "1px solid #f3f3f3",
  };

  const cardIds = cards.map((c) => c.id);

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button style={btnGrip} {...attributes} {...listeners} title="Kolonu sürükle">
            ⠿
          </button>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: 20,
                color: "#111",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {column.title}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 500,
                color: PRIMARY,
                background: PRIMARY_LIGHT,
                padding: "5px 12px",
                borderRadius: 999,
                display: "inline-block",
              }}
            >
              {cards.length} kart
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onRenameColumn(column)} style={btnGhost}>
            Ad
          </button>
          <button onClick={() => onDeleteColumn(column)} style={btnDanger}>
            Sil
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <button
        onClick={() => onAddCard(column)}
        style={{ ...btnPrimary, width: "100%", marginTop: 16 }}
      >
        + Kart ekle
      </button>
    </div>
  );
}

/* -------------------- Main -------------------- */
export default function ProgramBoardPage() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProgramId, setActiveProgramId] = useState(null);

  const [activeId, setActiveId] = useState(null);

  const [modal, setModal] = useState({ open: false, type: null, payload: null });
  const [form, setForm] = useState({ title: "", assigneeUserId: "" });

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const activeProgram = useMemo(
    () => programs.find((p) => p.id === activeProgramId),
    [programs, activeProgramId]
  );

  const columnIds = useMemo(
    () => activeProgram?.columns?.map((c) => c.id) || [],
    [activeProgram]
  );

  const activeCard = useMemo(() => {
    if (!activeId || !activeProgram) return null;
    const map = activeProgram.cardsByColumn || {};
    for (const colId of Object.keys(map)) {
      const found = (map[colId] || []).find((c) => c.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, activeProgram]);

  const activeColumn = useMemo(() => {
    if (!activeId || !activeProgram) return null;
    return activeProgram.columns.find((c) => c.id === activeId) || null;
  }, [activeId, activeProgram]);

  async function loadPrograms() {
    try {
      const res = await getPrograms(); // ✅ token yok, cookie var
      const apiPrograms = res.data || [];

      const mapped = apiPrograms.map((p) => {
        const cols = (p.columns || [])
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const cardsByColumn = {};
        cols.forEach((col) => {
          const cards = (col.cards || [])
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          cardsByColumn[col.id] = cards.map((c) => ({
            id: c.id,
            title: c.title,
            assigneeUserId: c.assigneeUser?.id || "",
            assignee: c.assigneeUser?.username || "",
          }));
        });

        return {
          id: p.id,
          title: p.name,
          columns: cols.map((c) => ({ id: c.id, title: c.title || c.name })),
          cardsByColumn,
        };
      });

      setPrograms(mapped);
      setActiveProgramId(mapped[0]?.id ?? null);
    } catch (e) {
      console.error("getPrograms error:", e?.response?.data || e.message);
      setPrograms([]);
      setActiveProgramId(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  async function fetchUsersIfNeeded() {
    if (users.length > 0) return;
    try {
      setUsersLoading(true);
      const res = await getUsers(); // ✅ token yok
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setUsers(list);
    } catch (e) {
      console.error("getUsers error:", e?.response?.data || e.message);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }

  function openModal(type, payload = null, initial = {}) {
    setForm({
      title: initial.title ?? "",
      assigneeUserId: initial.assigneeUserId ?? "",
    });

    if (type === "addCard" || type === "editCard") {
      fetchUsersIfNeeded();
    }

    setModal({ open: true, type, payload });
  }

  function closeModal() {
    setModal({ open: false, type: null, payload: null });
    setForm({ title: "", assigneeUserId: "" });
  }

  function updateActiveProgram(updater) {
    setPrograms((prev) =>
      prev.map((p) => (p.id === activeProgramId ? updater(p) : p))
    );
  }

  function findCardContainer(cardId) {
    if (!activeProgram) return null;
    for (const col of activeProgram.columns) {
      const list = activeProgram.cardsByColumn[col.id] || [];
      if (list.some((c) => c.id === cardId)) return col.id;
    }
    return null;
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !activeProgram) return;

    const aId = active.id;
    const oId = over.id;

    const snapshot = JSON.parse(JSON.stringify(programs));

    // Column reorder
    if (columnIds.includes(aId) && columnIds.includes(oId)) {
      if (aId === oId) return;

      const oldIndex = activeProgram.columns.findIndex((c) => c.id === aId);
      const newIndex = activeProgram.columns.findIndex((c) => c.id === oId);

      updateActiveProgram((p) => ({
        ...p,
        columns: arrayMove(p.columns, oldIndex, newIndex),
      }));

      try {
        await moveColumn(aId, newIndex); // ✅ token yok
      } catch (e) {
        console.error("moveColumn error:", e?.response?.data || e.message);
        setPrograms(snapshot);
      }
      return;
    }

    // Card drag
    const fromCol = findCardContainer(aId);
    if (!fromCol) return;

    const toCol = columnIds.includes(oId) ? oId : findCardContainer(oId);
    if (!toCol) return;

    const fromListNow = activeProgram.cardsByColumn[fromCol] || [];
    const toListNow = activeProgram.cardsByColumn[toCol] || [];

    // Same column reorder
    if (fromCol === toCol) {
      const oldIndex = fromListNow.findIndex((c) => c.id === aId);
      const newIndex = fromListNow.findIndex((c) => c.id === oId);
      if (oldIndex === -1 || newIndex === -1) return;

      updateActiveProgram((p) => ({
        ...p,
        cardsByColumn: {
          ...p.cardsByColumn,
          [fromCol]: arrayMove(p.cardsByColumn[fromCol], oldIndex, newIndex),
        },
      }));

      try {
        await moveCard(aId, fromCol, newIndex); // ✅ token yok
      } catch (e) {
        console.error("moveCard same-col error:", e?.response?.data || e.message);
        setPrograms(snapshot);
      }
      return;
    }

    let toIndex = 0;
    if (!columnIds.includes(oId)) {
      const overIndex = toListNow.findIndex((c) => c.id === oId);
      toIndex = overIndex >= 0 ? overIndex : toListNow.length;
    } else {
      toIndex = toListNow.length;
    }

    updateActiveProgram((p) => {
      const fromList = [...(p.cardsByColumn[fromCol] || [])];
      const toList = [...(p.cardsByColumn[toCol] || [])];

      const movingIndex = fromList.findIndex((c) => c.id === aId);
      if (movingIndex === -1) return p;

      const [moving] = fromList.splice(movingIndex, 1);
      toList.splice(toIndex, 0, moving);

      return {
        ...p,
        cardsByColumn: {
          ...p.cardsByColumn,
          [fromCol]: fromList,
          [toCol]: toList,
        },
      };
    });

    try {
      await moveCard(aId, toCol, toIndex); // ✅ token yok
    } catch (e) {
      console.error("moveCard cross-col error:", e?.response?.data || e.message);
      setPrograms(snapshot);
    }
  }

  /* ---------- Actions ---------- */
  function requestAddProgram() {
    openModal("addProgram", null, { title: "" });
  }

  function requestRenameProgram() {
    if (!activeProgram) return;
    openModal("renameProgram", activeProgram, { title: activeProgram.title });
  }

  function requestDeleteProgram() {
    if (!activeProgram) return;
    openModal("deleteProgram", activeProgram);
  }

  function requestAddColumn() {
    openModal("addCol", null, { title: "" });
  }

  function requestRenameColumn(column) {
    openModal("renameCol", column, { title: column.title });
  }

  function requestDeleteColumn(column) {
    openModal("deleteCol", column);
  }

  function requestAddCard(column) {
    openModal("addCard", column, { title: "", assigneeUserId: "" });
  }

  function requestEditCard(card) {
    openModal("editCard", card, {
      title: card.title,
      assigneeUserId: card.assigneeUserId || "",
    });
  }

  function requestDeleteCard(card) {
    openModal("deleteCard", card);
  }

  /* ---------- Submit modal ---------- */
  async function submitModal() {
    const t = modal.type;

    try {
      if (t === "addProgram") {
        if (!form.title.trim()) return;
        await createProgram({ name: form.title.trim() });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "renameProgram") {
        if (!form.title.trim() || !activeProgram) return;
        await updateProgram(activeProgram.id, { name: form.title.trim() });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "deleteProgram") {
        const prog = modal.payload;
        if (!prog) return;
        await deleteProgram(prog.id);
        await loadPrograms();
        closeModal();
        return;
      }

      if (!activeProgram) return;

      if (t === "addCol") {
        if (!form.title.trim()) return;
        await createColumn(activeProgram.id, { title: form.title.trim() });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "renameCol") {
        if (!form.title.trim()) return;
        const col = modal.payload;
        if (!col) return;
        await updateColumn(col.id, { name: form.title.trim() });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "deleteCol") {
        const col = modal.payload;
        if (!col) return;
        await deleteColumn(col.id);
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "addCard") {
        if (!form.title.trim()) return;
        const col = modal.payload;
        if (!col) return;
        await createCard(col.id, {
          title: form.title.trim(),
          assigneeUserId: form.assigneeUserId || null,
        });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "editCard") {
        if (!form.title.trim()) return;
        const card = modal.payload;
        if (!card) return;
        await updateCard(card.id, {
          title: form.title.trim(),
          content: "",
          assigneeUserId: form.assigneeUserId === "" ? null : form.assigneeUserId,
        });
        await loadPrograms();
        closeModal();
        return;
      }

      if (t === "deleteCard") {
        const card = modal.payload;
        if (!card) return;
        await deleteCard(card.id);
        await loadPrograms();
        closeModal();
        return;
      }
    } catch (e) {
      console.error("submitModal error:", e?.response?.data || e.message);
    }
  }

  const modalTitle =
    modal.type === "addProgram"
      ? "Yeni Program"
      : modal.type === "renameProgram"
      ? "Program Adı"
      : modal.type === "deleteProgram"
      ? "Program Sil"
      : modal.type === "addCard"
      ? "Kart Ekle"
      : modal.type === "editCard"
      ? "Kart Düzenle"
      : modal.type === "deleteCard"
      ? "Kart Sil"
      : modal.type === "addCol"
      ? "Kolon Ekle"
      : modal.type === "renameCol"
      ? "Kolon Adı"
      : modal.type === "deleteCol"
      ? "Kolon Sil"
      : "";

  const isConfirm = ["deleteCard", "deleteCol", "deleteProgram"].includes(modal.type);

  if (loading) return <div style={{ padding: 28 }}>Yükleniyor...</div>;
  if (!activeProgram) return <div style={{ padding: 28 }}>Program bulunamadı.</div>;

  return (
    <>
      <PageHeader />

      <div style={pageWrap}>
        <div style={headerWrap}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: PRIMARY }}>Program</div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <select
                value={activeProgramId || ""}
                onChange={(e) => setActiveProgramId(e.target.value)}
                style={selectStyle}
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <button onClick={requestAddProgram} style={btnGhost}>
                + Yeni Program
              </button>

              <button onClick={requestRenameProgram} style={btnGhost}>
                Program Adı
              </button>

              <button onClick={requestDeleteProgram} style={btnDanger}>
                Program Sil
              </button>
            </div>

            <div style={{ fontSize: 28, fontWeight: 500, color: "#111" }}>
              {activeProgram.title}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#667085" }}>
              Kolonları ve kartları sürükleyip bırakabilirsin.
            </div>
          </div>

          <button onClick={requestAddColumn} style={btnPrimary}>
            + Kolon ekle
          </button>
        </div>

        <div style={{ marginTop: 22, overflowX: "auto", paddingBottom: 10 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {activeProgram.columns.map((col) => (
                  <SortableColumn
                    key={col.id}
                    column={col}
                    cards={activeProgram.cardsByColumn[col.id] || []}
                    onAddCard={requestAddCard}
                    onRenameColumn={requestRenameColumn}
                    onDeleteColumn={requestDeleteColumn}
                    onEditCard={requestEditCard}
                    onDeleteCard={requestDeleteCard}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeCard ? (
                <div style={{ width: 360 }}>
                  <Card card={activeCard} overlay onEdit={() => {}} onDelete={() => {}} />
                </div>
              ) : activeColumn ? (
                <div
                  style={{
                    minWidth: 360,
                    background: "#fff",
                    borderRadius: 22,
                    padding: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    border: "1px solid #f3f3f3",
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 20, color: "#111" }}>
                    {activeColumn.title}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <Modal
          open={modal.open}
          title={modalTitle}
          onClose={closeModal}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={closeModal} style={btnGhost}>
                İptal
              </button>
              <button onClick={submitModal} style={btnPrimary}>
                {isConfirm ? "Evet, Sil" : "Kaydet"}
              </button>
            </div>
          }
        >
          {["addProgram", "renameProgram"].includes(modal.type) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Program adı">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Örn: CRM Projesi / Portlink Demo"
                />
              </Field>
            </div>
          ) : null}

          {["addCard", "editCard"].includes(modal.type) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Kart adı">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Örn: Swagger düzenleme"
                />
              </Field>

              <Field label="Kim yapıyor?">
                <select
                  value={form.assigneeUserId}
                  onChange={(e) => setForm((p) => ({ ...p, assigneeUserId: e.target.value }))}
                  style={selectStyle}
                >
                  <option value="">{usersLoading ? "Yükleniyor..." : "Atanan yok"}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} {u.email ? `(${u.email})` : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ) : null}

          {["addCol", "renameCol"].includes(modal.type) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Kolon adı">
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Örn: Beklemede"
                />
              </Field>
            </div>
          ) : null}

          {modal.type === "deleteCard" ? (
            <div style={{ fontSize: 14, fontWeight: 500, color: "#475467" }}>
              <span style={{ color: PRIMARY, fontWeight: 500 }}>
                "{modal.payload?.title}"
              </span>{" "}
              kartını silmek istiyor musun?
            </div>
          ) : null}

          {modal.type === "deleteCol" ? (
            <div style={{ fontSize: 14, fontWeight: 500, color: "#475467" }}>
              <span style={{ color: PRIMARY, fontWeight: 500 }}>
                "{modal.payload?.title}"
              </span>{" "}
              kolonu silinecek ve içindeki kartlar da silinir. Emin misin?
            </div>
          ) : null}

          {modal.type === "deleteProgram" ? (
            <div style={{ fontSize: 14, fontWeight: 500, color: "#475467" }}>
              <span style={{ color: PRIMARY, fontWeight: 500 }}>
                "{modal.payload?.title}"
              </span>{" "}
              programı tamamen silinsin mi?
            </div>
          ) : null}
        </Modal>
      </div>
    </>
  );
}

/* -------------------- Styles -------------------- */
const pageWrap = {
  padding: 28,
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 10% 0%, rgba(233,43,99,0.12) 0%, rgba(233,43,99,0.00) 60%), #f8f9fb",
};

const headerWrap = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  background: "#fff",
  padding: 22,
  borderRadius: 24,
  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  border: "1px solid #f1f1f1",
};

const btnPrimary = {
  padding: "12px 16px",
  borderRadius: 16,
  border: "none",
  background: PRIMARY,
  color: "#fff",
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(233,43,99,0.3)",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 500,
  cursor: "pointer",
};

const btnDanger = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 500,
  cursor: "pointer",
};

const btnGrip = {
  width: 40,
  height: 40,
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  cursor: "grab",
  fontWeight: 500,
  fontSize: 18,
  color: PRIMARY,
};

const selectStyle = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 500,
  fontSize: 14,
  outline: "none",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(17,17,17,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 9999,
};

const modalCard = {
  width: "100%",
  maxWidth: 520,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 26px 80px rgba(0,0,0,0.25)",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
};

const modalHeader = {
  padding: 16,
  borderBottom: "1px solid #f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const modalFooter = {
  padding: 16,
  borderTop: "1px solid #f0f0f0",
  background: "rgba(255,255,255,0.65)",
};

const modalDot = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: PRIMARY,
  boxShadow: "0 0 0 6px rgba(233,43,99,0.12)",
};

const xBtn = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: "1px solid #eee",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  outline: "none",
  fontSize: 15,
  fontWeight: 500,
  boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
};
