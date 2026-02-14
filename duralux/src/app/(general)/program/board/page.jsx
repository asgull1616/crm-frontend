"use client";

import React, { useMemo, useState } from "react";
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

const PRIMARY = "#E92B63";
const PRIMARY_LIGHT = "#FFE4EC";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* -------------------- Modal -------------------- */
function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div style={modalOverlay} onMouseDown={onClose}>
      <div style={modalCard} onMouseDown={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={modalDot} />
            <div style={{ fontWeight: 950, fontSize: 18 }}>{title}</div>
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
      <div style={{ fontSize: 13, fontWeight: 900, color: "#344054" }}>{label}</div>
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
        fontWeight: 900,
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
          <div style={{ fontWeight: 950, fontSize: 18, color: "#111", lineHeight: 1.3 }}>
            {card.title}
          </div>

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={card.assignee || "Atanmadı"} />
            <div style={{ fontSize: 15, fontWeight: 900, color: "#667085" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button style={btnGrip} {...attributes} {...listeners} title="Kolonu sürükle">
            ⠿
          </button>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 950,
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
                fontWeight: 950,
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
              <SortableCard key={card.id} card={card} onEdit={onEditCard} onDelete={onDeleteCard} />
            ))}
          </div>
        </SortableContext>
      </div>

      <button onClick={() => onAddCard(column)} style={{ ...btnPrimary, width: "100%", marginTop: 16 }}>
        + Kart ekle
      </button>
    </div>
  );
}

/* -------------------- Main -------------------- */
export default function ProgramBoardPage() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Programs (multiple)
  const [programs, setPrograms] = useState(() => {
    const p1 = {
      id: "p1",
      title: "CRM PROJESİ",
      columns: [
        { id: "p1-col-todo", title: "Yapılacaklar" },
        { id: "p1-col-doing", title: "Yapılıyor" },
        { id: "p1-col-done", title: "Tamamlandı" },
      ],
      cardsByColumn: {
        "p1-col-todo": [
          { id: "p1-c1", title: "CRM teklif ekranı", assignee: "Ayşegül" },
          { id: "p1-c2", title: "Sanallaştırma ödevi", assignee: "Sudenur" },
        ],
        "p1-col-doing": [{ id: "p1-c3", title: "Swagger düzenleme", assignee: "Sudenur" }],
        "p1-col-done": [{ id: "p1-c4", title: "Login ekranı tamamlandı", assignee: "Sudenur" }],
      },
    };

    const p2 = {
      id: "p2",
      title: "Portlink Demo",
      columns: [
        { id: "p2-col-todo", title: "Backlog" },
        { id: "p2-col-doing", title: "In Progress" },
        { id: "p2-col-done", title: "Done" },
      ],
      cardsByColumn: {
        "p2-col-todo": [{ id: "p2-c1", title: "Demo senaryosu çıkar", assignee: "Sude" }],
        "p2-col-doing": [],
        "p2-col-done": [],
      },
    };

    return [p1, p2];
  });

  const [activeProgramId, setActiveProgramId] = useState("p1");

  const activeProgram = useMemo(
    () => programs.find((p) => p.id === activeProgramId),
    [programs, activeProgramId]
  );

  const [activeId, setActiveId] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ open: false, type: null, payload: null });
  const [form, setForm] = useState({ title: "", assignee: "" });

  const columnIds = useMemo(() => activeProgram?.columns?.map((c) => c.id) || [], [activeProgram]);

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

  function openModal(type, payload = null, initial = {}) {
    setForm({ title: initial.title ?? "", assignee: initial.assignee ?? "" });
    setModal({ open: true, type, payload });
  }

  function closeModal() {
    setModal({ open: false, type: null, payload: null });
    setForm({ title: "", assignee: "" });
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

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !activeProgram) return;

    const aId = active.id;
    const oId = over.id;

    // Column drag
    if (columnIds.includes(aId) && columnIds.includes(oId)) {
      if (aId === oId) return;
      const oldIndex = activeProgram.columns.findIndex((c) => c.id === aId);
      const newIndex = activeProgram.columns.findIndex((c) => c.id === oId);

      updateActiveProgram((p) => ({
        ...p,
        columns: arrayMove(p.columns, oldIndex, newIndex),
      }));
      return;
    }

    // Card drag
    const fromCol = findCardContainer(aId);
    if (!fromCol) return;

    const toCol = columnIds.includes(oId) ? oId : findCardContainer(oId);
    if (!toCol) return;

    if (fromCol === toCol) {
      const list = activeProgram.cardsByColumn[fromCol] || [];
      const oldIndex = list.findIndex((c) => c.id === aId);
      const newIndex = list.findIndex((c) => c.id === oId);
      if (oldIndex === -1 || newIndex === -1) return;

      updateActiveProgram((p) => ({
        ...p,
        cardsByColumn: {
          ...p.cardsByColumn,
          [fromCol]: arrayMove(p.cardsByColumn[fromCol], oldIndex, newIndex),
        },
      }));
      return;
    }

    // Move between columns
    updateActiveProgram((p) => {
      const fromList = [...(p.cardsByColumn[fromCol] || [])];
      const toList = [...(p.cardsByColumn[toCol] || [])];

      const movingIndex = fromList.findIndex((c) => c.id === aId);
      if (movingIndex === -1) return p;

      const [moving] = fromList.splice(movingIndex, 1);

      if (!columnIds.includes(oId)) {
        const overIndex = toList.findIndex((c) => c.id === oId);
        if (overIndex >= 0) toList.splice(overIndex, 0, moving);
        else toList.push(moving);
      } else {
        toList.push(moving);
      }

      return {
        ...p,
        cardsByColumn: {
          ...p.cardsByColumn,
          [fromCol]: fromList,
          [toCol]: toList,
        },
      };
    });
  }

  /* ---------- Program actions ---------- */
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

  /* ---------- Column actions ---------- */
  function requestAddColumn() {
    openModal("addCol", null, { title: "" });
  }
  function requestRenameColumn(column) {
    openModal("renameCol", column, { title: column.title });
  }
  function requestDeleteColumn(column) {
    openModal("deleteCol", column);
  }

  /* ---------- Card actions ---------- */
  function requestAddCard(column) {
    openModal("addCard", column, { title: "", assignee: "" });
  }
  function requestEditCard(card) {
    openModal("editCard", card, { title: card.title, assignee: card.assignee || "" });
  }
  function requestDeleteCard(card) {
    openModal("deleteCard", card);
  }

  /* ---------- Submit modal ---------- */
  function submitModal() {
    const t = modal.type;

    // Programs
    if (t === "addProgram") {
      if (!form.title.trim()) return;
      const pid = `p-${uid()}`;
      const colTodo = `${pid}-col-todo`;
      const colDoing = `${pid}-col-doing`;
      const colDone = `${pid}-col-done`;

      const newProgram = {
        id: pid,
        title: form.title.trim(),
        columns: [
          { id: colTodo, title: "Yapılacaklar" },
          { id: colDoing, title: "Yapılıyor" },
          { id: colDone, title: "Tamamlandı" },
        ],
        cardsByColumn: { [colTodo]: [], [colDoing]: [], [colDone]: [] },
      };

      setPrograms((prev) => [newProgram, ...prev]);
      setActiveProgramId(pid);
      closeModal();
      return;
    }

    if (t === "renameProgram") {
      if (!form.title.trim()) return;
      updateActiveProgram((p) => ({ ...p, title: form.title.trim() }));
      closeModal();
      return;
    }

    if (t === "deleteProgram") {
      const prog = modal.payload;
      setPrograms((prev) => prev.filter((p) => p.id !== prog.id));
      // fallback active
      setTimeout(() => {
        setPrograms((prev) => {
          const next = prev.filter((p) => p.id !== prog.id);
          const pick = next[0]?.id;
          if (pick) setActiveProgramId(pick);
          return next;
        });
      }, 0);
      closeModal();
      return;
    }

    if (!activeProgram) return;

    // Columns
    if (t === "addCol") {
      if (!form.title.trim()) return;
      const id = `${activeProgram.id}-col-${uid()}`;

      updateActiveProgram((p) => ({
        ...p,
        columns: [...p.columns, { id, title: form.title.trim() }],
        cardsByColumn: { ...p.cardsByColumn, [id]: [] },
      }));
      closeModal();
      return;
    }

    if (t === "renameCol") {
      if (!form.title.trim()) return;
      const col = modal.payload;

      updateActiveProgram((p) => ({
        ...p,
        columns: p.columns.map((c) => (c.id === col.id ? { ...c, title: form.title.trim() } : c)),
      }));
      closeModal();
      return;
    }

    if (t === "deleteCol") {
      const col = modal.payload;

      updateActiveProgram((p) => {
        const copy = { ...p.cardsByColumn };
        delete copy[col.id];

        return {
          ...p,
          columns: p.columns.filter((c) => c.id !== col.id),
          cardsByColumn: copy,
        };
      });
      closeModal();
      return;
    }

    // Cards
    if (t === "addCard") {
      if (!form.title.trim()) return;
      const col = modal.payload;
      const newCard = {
        id: `${activeProgram.id}-card-${uid()}`,
        title: form.title.trim(),
        assignee: form.assignee.trim(),
      };

      updateActiveProgram((p) => ({
        ...p,
        cardsByColumn: {
          ...p.cardsByColumn,
          [col.id]: [...(p.cardsByColumn[col.id] || []), newCard],
        },
      }));
      closeModal();
      return;
    }

    if (t === "editCard") {
      if (!form.title.trim()) return;
      const card = modal.payload;

      updateActiveProgram((p) => {
        const copy = { ...p.cardsByColumn };
        for (const colId of Object.keys(copy)) {
          copy[colId] = copy[colId].map((c) =>
            c.id === card.id ? { ...c, title: form.title.trim(), assignee: form.assignee.trim() } : c
          );
        }
        return { ...p, cardsByColumn: copy };
      });
      closeModal();
      return;
    }

    if (t === "deleteCard") {
      const card = modal.payload;

      updateActiveProgram((p) => {
        const copy = { ...p.cardsByColumn };
        for (const colId of Object.keys(copy)) {
          copy[colId] = copy[colId].filter((c) => c.id !== card.id);
        }
        return { ...p, cardsByColumn: copy };
      });
      closeModal();
      return;
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

  if (!activeProgram) return null;

  return (
    <><PageHeader />
    <div style={pageWrap}>
      {/* Header */}
      <div style={headerWrap}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 950, color: PRIMARY }}>Program</div>

          {/* Program selector row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <select
              value={activeProgramId}
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

          <div style={{ fontSize: 28, fontWeight: 950, color: "#111" }}>{activeProgram.title}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#667085" }}>
            Kolonları ve kartları sürükleyip bırakabilirsin.
          </div>
        </div>

        <button onClick={requestAddColumn} style={btnPrimary}>
          + Kolon ekle
        </button>
      </div>

      {/* Board */}
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
                <div style={{ fontWeight: 950, fontSize: 20, color: "#111" }}>{activeColumn.title}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal */}
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
              <Input
                value={form.assignee}
                onChange={(e) => setForm((p) => ({ ...p, assignee: e.target.value }))}
                placeholder="Örn: Sudenur"
              />
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
          <div style={{ fontSize: 14, fontWeight: 900, color: "#475467" }}>
            <span style={{ color: PRIMARY, fontWeight: 950 }}>"{modal.payload?.title}"</span> kartını silmek istiyor musun?
          </div>
        ) : null}

        {modal.type === "deleteCol" ? (
          <div style={{ fontSize: 14, fontWeight: 900, color: "#475467" }}>
            <span style={{ color: PRIMARY, fontWeight: 950 }}>"{modal.payload?.title}"</span> kolonu silinecek ve içindeki
            kartlar da silinir. Emin misin?
          </div>
        ) : null}

        {modal.type === "deleteProgram" ? (
          <div style={{ fontSize: 14, fontWeight: 900, color: "#475467" }}>
            <span style={{ color: PRIMARY, fontWeight: 950 }}>"{modal.payload?.title}"</span> programı tamamen silinsin mi?
          </div>
        ) : null}
      </Modal>
    </div></>
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
  fontWeight: 950,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(233,43,99,0.3)",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 950,
  cursor: "pointer",
};

const btnDanger = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(233,43,99,0.22)",
  background: PRIMARY_LIGHT,
  color: PRIMARY,
  fontWeight: 950,
  cursor: "pointer",
};

const btnGrip = {
  width: 40,
  height: 40,
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  cursor: "grab",
  fontWeight: 950,
  fontSize: 18,
  color: PRIMARY,
};

const selectStyle = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid #eee",
  background: "#fff",
  fontWeight: 900,
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
  fontWeight: 950,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #eee",
  outline: "none",
  fontSize: 15,
  fontWeight: 900,
  boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
};
