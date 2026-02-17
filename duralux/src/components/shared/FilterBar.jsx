"use client";

import { useState } from "react";
import { FiSearch, FiCalendar, FiUser, FiFilter } from "react-icons/fi";

export default function FilterBar({
  showSearch = false,
  showDateRange = false,
  showStatus = false,
  showUser = false,
  showCustomer = false,
  showType = false,
  showDueStatus = false,
  customers = [],
  users = [],
  filters = {},
  onChange,
}) {
  const currentYear = new Date().getFullYear();

  const handleChange = (key, value) => {
    onChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="modern-filter-bar">
      {showSearch && (
        <div className="filter-item search">
          <FiSearch />
          <input
            type="text"
            placeholder="Ara..."
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
      )}

      {showDateRange && (
        <>
          <div className="filter-item">
            <FiCalendar />
            <input
              type="date"
              value={filters?.dateFrom || ""}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
            />

            <input
              type="date"
              value={filters?.dateTo || ""}
              min={filters?.dateFrom || undefined}
              onChange={(e) => handleChange("dateTo", e.target.value)}
            />
          </div>
        </>
      )}

      {showStatus && (
        <div className="filter-item">
          <FiFilter />
          <select onChange={(e) => handleChange("status", e.target.value)}>
            <option value="">Durum</option>
            <option value="PAID">Ödendi</option>
            <option value="PENDING">Bekliyor</option>
          </select>
        </div>
      )}

      {showUser && (
        <div className="filter-item">
          <FiUser />
          <select onChange={(e) => handleChange("user", e.target.value)}>
            <option value="">Çalışan</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </div>
      )}
      {showDueStatus && (
        <div className="filter-item">
          <FiFilter />
          <select onChange={(e) => handleChange("dueStatus", e.target.value)}>
            <option value="">Vade Durumu</option>
            <option value="OVERDUE">Geciken</option>
            <option value="PENDING">Bekleyen</option>
            <option value="PAID">Ödendi</option>
          </select>
        </div>
      )}

      {showCustomer && (
        <div className="filter-item">
          <FiUser />
          <select onChange={(e) => handleChange("customerId", e.target.value)}>
            <option value="">Müşteri</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName || c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {showType && (
        <div className="filter-item">
          <FiFilter />
          <select onChange={(e) => handleChange("type", e.target.value)}>
            <option value="">Tür</option>
            <option value="INCOME">Gelir</option>
            <option value="EXPENSE">Gider</option>
          </select>
        </div>
      )}
    </div>
  );
}
