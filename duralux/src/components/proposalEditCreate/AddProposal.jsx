"use client";

import React, { useState, useEffect } from 'react';

const AddProposal = ({ previtems, onItemsChange }) => {
    const [items, setItems] = useState(previtems || []);

    // Dinamik Hesaplamalar
    const subTotal = items.reduce((acc, item) => acc + (Number(item.unitPrice || 0) * Number(item.quantity || 0)), 0);
    const totalTax = items.reduce((acc, item) => {
        const lineTotal = Number(item.unitPrice || 0) * Number(item.quantity || 0);
        return acc + (lineTotal * (Number(item.taxRate || 0) / 100));
    }, 0);
    const grandTotal = subTotal + totalTax;

    useEffect(() => {
        if (onItemsChange) {
            // Backend'in beklediği temizlenmiş veriyi ve hesaplanmış toplam tutarı gönderiyoruz
            const cleanedItems = items.map(({ id, ...rest }) => ({
                ...rest,
                quantity: Number(rest.quantity),
                unitPrice: Number(rest.unitPrice),
                taxRate: Number(rest.taxRate)
            }));

            // Hem kalemleri hem de bu kalemlerden doğan toplam tutarı üst komponente iletiyoruz
            onItemsChange(cleanedItems, grandTotal.toFixed(2));
        }
    }, [items, grandTotal, onItemsChange]);

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            description: '', 
            quantity: 1,      
            unitPrice: 0,     
            taxRate: 20       
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    return (
        <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="row">
                        {/* Sol Taraf: Tablo */}
                        <div className="col-lg-9">
                            <div className="mb-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Teklif Kalemleri</h5>
                                    <span className="fs-13 text-muted">Hizmet detaylarını ve birim fiyatları aşağıya giriniz.</span>
                                </div>
                                <button
                                    className="btn btn-md text-white fw-bold px-4 shadow-sm"
                                    onClick={addItem}
                                    style={{ backgroundColor: "#E92B63", borderColor: "#E92B63", borderRadius: '8px' }}
                                >
                                    + Yeni Kalem Ekle
                                </button>
                            </div>
                            
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border-light">
                                    <thead className="bg-light">
                                        <tr className="text-muted small text-uppercase">
                                            <th className="text-center" style={{ width: '50px' }}>#</th>
                                            <th>Ürün / Hizmet Açıklaması</th>
                                            <th className="text-center" style={{ width: '100px' }}>Adet</th>
                                            <th className="text-end" style={{ width: '160px' }}>Birim Fiyat</th>
                                            <th className="text-center" style={{ width: '100px' }}>KDV (%)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="text-center fw-bold text-muted">{index + 1}</td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        className="form-control border-light" 
                                                        placeholder="Örn: Portlink Yazılım Lisansı" 
                                                        value={item.description} 
                                                        onChange={(e) => handleInputChange(item.id, 'description', e.target.value)} 
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center border-light" 
                                                        value={item.quantity} 
                                                        onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)} 
                                                    />
                                                </td>
                                                <td>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light text-muted border-light">₺</span>
                                                        <input 
                                                            type="number" 
                                                            className="form-control text-end fw-bold border-light" 
                                                            value={item.unitPrice} 
                                                            onChange={(e) => handleInputChange(item.id, 'unitPrice', e.target.value)} 
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center border-light" 
                                                        value={item.taxRate} 
                                                        onChange={(e) => handleInputChange(item.id, 'taxRate', e.target.value)} 
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-link text-danger p-0" onClick={() => removeItem(item.id)}>
                                                        <i className="feather-trash-2 fs-5"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sağ Taraf: Özet Tutar */}
                        <div className="col-lg-3">
                            <div className="card border shadow-none h-100" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-3">Özet Tutar</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Ara Toplam:</span>
                                        <span className="fw-bold small">₺{subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Toplam KDV:</span>
                                        <span className="fw-bold small text-danger">₺{totalTax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between bg-white p-2 rounded border mb-3">
                                        <span className="fw-bold">Genel Toplam:</span>
                                        <span className="fw-bold text-primary">₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProposal;