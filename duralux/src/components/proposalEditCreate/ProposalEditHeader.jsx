"use client";

import React from "react";
import { FiLayers, FiSave } from "react-icons/fi";

export default function ProposalEditHeader({ onSave, onSaveAndSend, loading }) {
  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <button
        className="btn btn-light-brand"
        type="button"
        onClick={onSaveAndSend}
        disabled={loading}
      >
        <FiLayers size={16} className="me-2" />
        <span>{loading ? "İşleniyor..." : "Kaydet & Gönder"}</span>
      </button>

      <button
        className="btn btn-primary"
        type="button"
        onClick={onSave}
        disabled={loading}
      >
        <FiSave size={16} className="me-2" />
        <span>{loading ? "İşleniyor..." : "Kaydet"}</span>
      </button>
    </div>
  );
}
