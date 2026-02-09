"use client";

import React, { useState, useEffect } from 'react';

const AddProposal = ({ previtems, onItemsChange }) => {
    // HATA ÇÖZÜMÜ: previtems undefined ise boş bir dizi ile başlat
    const [items, setItems] = useState(previtems || []);

    // Kalemlerde her değişiklik olduğunda üst bileşene haber ver
    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items);
        }
    }, [items, onItemsChange]);

    const addItem = () => {
        const newItem = {
            id: Date.now(), // Daha benzersiz bir ID için Date.now()
            product: '',
            qty: 1,
            price: 0,
            tax: 20, // Varsayılan KDV %20
            total: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        // Belirli bir ID'ye göre silme işlemi (pop yerine filter kullanımı daha güvenlidir)
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

    // HATA ÇÖZÜMÜ: items?.reduce kullanarak dizinin varlığından emin oluyoruz
    const subTotal = items?.reduce((accumulator, currentValue) => {
        return accumulator + (Number(currentValue.price || 0) * Number(currentValue.qty || 0));
    }, 0) || 0;

    // Satır bazlı KDV hesaplandığı için toplam KDV'yi de reduce ile alıyoruz
    const totalTaxAmount = items?.reduce((accumulator, currentValue) => {
        const itemSub = Number(currentValue.price || 0) * Number(currentValue.qty || 0);
        return accumulator + (itemSub * (Number(currentValue.tax || 0) / 100));
    }, 0) || 0;

    const grandTotal = subTotal + totalTaxAmount;

    return (
        <div className="col-12">
            <div className="card stretch stretch-full proposal-table">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold">Teklif Kalemleri:</h5>
                                    <span className="fs-12 text-muted">Teklifte sunulan ürün ve hizmetlerin listesi</span>
                                </div>
                                <button
                                    className="btn btn-md text-white shadow-sm"
                                    onClick={addItem}
                                    style={{ backgroundColor: "#E92B63", borderColor: "#E92B63" }}
                                >
                                    + Yeni Kalem Ekle
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered overflow-hidden">
                                    <thead>
                                        <tr className="bg-light">
                                            <th className="text-center wd-50">#</th>
                                            <th className="text-center">Hizmet / Ürün</th>
                                            <th className="text-center wd-100">Adet</th>
                                            <th className="text-center wd-150">Birim Fiyat</th>
                                            <th className="text-center wd-100">KDV (%)</th>
                                            <th className="text-center wd-150">Ara Toplam</th>
                                            <th className="text-center wd-50">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length > 0 ? (
                                            items.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="text-center align-middle">{index + 1}</td>
                                                    <td>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Hizmet / Ürün Adı" 
                                                            value={item.product} 
                                                            onChange={(e) => handleInputChange(item.id, 'product', e.target.value)} 
                                                        />
                                                    </td>
                                                    <td>
                                                        <input 
                                                            type="number" 
                                                            className="form-control text-center" 
                                                            value={item.qty} 
                                                            min="1" 
                                                            onChange={(e) => handleInputChange(item.id, 'qty', parseInt(e.target.value) || 0)} 
                                                        />
                                                    </td>
                                                    <td>
                                                        <input 
                                                            type="number" 
                                                            className="form-control text-end" 
                                                            value={item.price} 
                                                            onChange={(e) => handleInputChange(item.id, 'price', parseFloat(e.target.value) || 0)} 
                                                        />
                                                    </td>
                                                    <td>
                                                        <select 
                                                            className="form-control" 
                                                            value={item.tax} 
                                                            onChange={(e) => handleInputChange(item.id, 'tax', parseInt(e.target.value))}
                                                        >
                                                            <option value="0">%0</option>
                                                            <option value="1">%1</option>
                                                            <option value="10">%10</option>
                                                            <option value="20">%20</option>
                                                        </select>
                                                    </td>
                                                    <td className="text-end align-middle fw-bold">
                                                        ₺{(item.qty * item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-soft-danger" onClick={() => removeItem(item.id)}>
                                                            <i className="feather-trash-2"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-4">Henüz bir kalem eklenmedi.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card border shadow-none bg-gray-50">
                                <div className="card-body">
                                    <h5 className="fw-bold mb-3">Özet Tutar</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Ara Toplam:</span>
                                        <span className="fw-bold">₺{subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Toplam KDV:</span>
                                        <span className="fw-bold text-danger">₺{totalTaxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span className="h6 fw-bold">Genel Toplam:</span>
                                        <span className="h5 fw-bold text-primary">₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
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