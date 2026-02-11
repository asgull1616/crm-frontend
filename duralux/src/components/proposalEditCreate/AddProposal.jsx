"use client";

import React, { useState, useEffect } from 'react';

const AddProposal = ({ previtems, onItemsChange }) => {
    const [items, setItems] = useState(previtems || []);

    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items);
        }
    }, [items, onItemsChange]);

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            product: '',      
            description: '',  
            warranty: '',     
            price: 0,         
            qty: 1,           
            tax: 0            
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

    const totalAmount = items?.reduce((acc, item) => acc + Number(item.price || 0), 0) || 0;

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
                                    <span className="fs-13 text-muted">Hizmet detaylarını ve garanti sürelerini aşağıya giriniz.</span>
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
                                            <th>Ürün / Hizmet</th>
                                            <th>İçerik Açıklaması</th>
                                            <th className="text-center">Garanti</th>
                                            <th className="text-end">Satış Fiyatı</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="text-center fw-bold text-muted">{index + 1}</td>
                                                <td>
                                                    <input type="text" className="form-control border-light" placeholder="Örn: Yazılım Paketi" value={item.product} onChange={(e) => handleInputChange(item.id, 'product', e.target.value)} />
                                                </td>
                                                <td>
                                                    <textarea className="form-control border-light" rows="1" placeholder="Detaylar..." value={item.description} onChange={(e) => handleInputChange(item.id, 'description', e.target.value)} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control text-center border-light" placeholder="2 Yıl" value={item.warranty} onChange={(e) => handleInputChange(item.id, 'warranty', e.target.value)} />
                                                </td>
                                                <td>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light text-muted border-light">₺</span>
                                                        <input type="number" className="form-control text-end fw-bold border-light" value={item.price} onChange={(e) => handleInputChange(item.id, 'price', parseFloat(e.target.value) || 0)} />
                                                    </div>
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

                        {/* Sağ Taraf: İSTEDİĞİN ÖZET TUTAR KISMI */}
                        <div className="col-lg-3">
                            <div className="card border shadow-none h-100" style={{ backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-3">Özet Tutar</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Ara Toplam:</span>
                                        <span className="fw-bold small">₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Toplam KDV:</span>
                                        <span className="fw-bold small text-danger">₺0,00</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">Genel Toplam:</span>
                                        <span className="fw-bold text-primary">₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
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