"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const AddProposal = ({ previtems = [], onItemsChange }) => {
  const [items, setItems] = useState([]);

  // 🔹 Sayfa açıldığında dışarıdan gelen verileri tabloya basar
  useEffect(() => {
    if (previtems && previtems.length > 0) {
      setItems(previtems);
    }
  }, [previtems]);

  useEffect(() => {
    if (onItemsChange) onItemsChange(items);
  }, [items, onItemsChange]);

  const handleChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: "15px" }}>
      <div className="card-header bg-white border-0 p-4 d-flex justify-content-between">
        <h5 className="fw-bold mb-0">Teklif Kalemleri</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setItems([...items, { id: Math.random(), product: "", content: "", guaranty: "2 Yıl", price: 0, qty: 1, tax: 20 }])}>
          <FiPlus /> Yeni Kalem
        </button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="bg-light small text-uppercase">
            <tr>
              <th className="ps-4">Ürün / Hizmet</th>
              <th>İçerik Açıklaması</th>
              <th style={{width:'150px'}}>Garanti</th>
              <th style={{width:'160px'}}>Satış Fiyatı</th>
              <th style={{width:'50px'}}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="ps-4">
                  <input type="text" className="form-control form-control-sm" value={item.product} onChange={(e)=>handleChange(item.id, "product", e.target.value)} />
                </td>
                <td>
                  <input type="text" className="form-control form-control-sm" value={item.content} onChange={(e)=>handleChange(item.id, "content", e.target.value)} />
                </td>
                <td>
                  <select className="form-select form-select-sm" value={item.guaranty} onChange={(e)=>handleChange(item.id, "guaranty", e.target.value)}>
                    <option value="Yok">Yok</option>
                    <option value="1 Yıl">1 Yıl</option>
                    <option value="2 Yıl">2 Yıl</option>
                    <option value="3 Yıl">3 Yıl</option>
                  </select>
                </td>
                <td>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">₺</span>
                    <input type="number" className="form-control" value={item.price} onChange={(e)=>handleChange(item.id, "price", e.target.value)} />
                  </div>
                </td>
                <td className="pe-4">
                  <button className="btn btn-link text-danger p-0" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProposal;