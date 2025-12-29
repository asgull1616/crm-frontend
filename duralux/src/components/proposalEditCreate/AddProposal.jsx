import React, { useState } from 'react'


const AddProposal = ({previtems}) => {
    const [items, setItems] = useState(previtems);

    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            product: '',
            qty: 1,
            price: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem =()=>{
        items.pop()
      
        setItems(items)
    }


    const handleInputChange = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'qty' || field === 'price') {
                    updatedItem.total = updatedItem.qty * updatedItem.price;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const subTotal = items.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.qty);
    }, 0);

    const vat = (subTotal * 0.1).toFixed(2)
    const vatNumber = Number(vat);
    const total = Number(subTotal + vatNumber).toFixed(2)

    return (
        <div className="col-12">
            <div className="card stretch stretch-full proposal-table">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-4">
                                <h5 className="fw-bold">Teklif Kalemleri:</h5>
                                <span className="fs-12 text-muted">Teklifte sunulan ürün ve/veya hizmetlerin listelendiği bölüm</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered overflow-hidden" id="tab_logic">
                                    <thead>
                                        <tr className="single-item">
                                            <th className="text-center">Açıklama</th>
                                            <th className="text-center wd-450">Hizmet / Ürün</th>
                                            <th className="text-center wd-150">Adet</th>
                                            <th className="text-center wd-150">Birim Fiyat</th>
                                            <th className="text-center wd-150">Ara Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map(({ id, price, product, qty, total }, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{id}</td>
                                                        <td><input type="text" name="product" placeholder="Hizmet / Ürün" className="form-control" defaultValue={product} /></td>
                                                        <td><input type="number" name="qty" placeholder="Qty" className="form-control qty" step="1" min="1" defaultValue={qty} onChange={(e) => handleInputChange(id, 'qty', parseInt(e.target.value))} /></td>
                                                        <td><input type="number" name="price" placeholder="Unit Price" className="form-control price" step="1.00" min="1" defaultValue={price} onChange={(e) => handleInputChange(id, 'price', parseFloat(e.target.value))} /></td>
                                                        <td><input type="number" name="total" placeholder="0.00" className="form-control total" readOnly value={qty * price} /></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button className="btn btn-md bg-soft-danger text-danger" onClick={removeItem}>Sil</button>
                                <button className="btn btn-md btn-primary" onClick={addItem}>Teklifi Ekle</button>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="mb-4">
                                <h5 className="fw-bold">Toplam Tutar:</h5>
                                <span className="fs-12 text-muted">Toplam teklif tutarı</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered" id="tab_logic_total">
                                    <tbody>
                                        <tr className="single-item">
                                            <th className="fs-10 text-dark text-uppercase">Ara Toplam</th>
                                            <td className="w-25"><input type="number" name="sub_total" placeholder="0.00" className="form-control border-0 bg-transparent p-0" id="sub_total" readOnly value={subTotal} /></td>
                                        </tr>
                                        <tr className="single-item">
                                            <th className="fs-10 text-dark text-uppercase">İndirim</th>
                                            <td className="w-25">
                                                <div className="input-group mb-2 mb-sm-0">
                                                    <input type="number" className="form-control border-0 bg-transparent p-0" id="tax" placeholder="0" defaultValue="10" />
                                                    <div className="input-group-addon">%</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="single-item">
                                            <th className="fs-10 text-dark text-uppercase">Vergi Miktarı</th>
                                            <td className="w-25"><input type="number" name="tax_amount" id="tax_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0" readOnly value={vat} /></td>
                                        </tr>
                                        <tr className="single-item">
                                            <th className="fs-10 text-dark text-uppercase bg-gray-100">Toplam Tutar</th>
                                            <td className="bg-gray-100 w-25"><input type="number" name="total_amount" id="total_amount" placeholder="0.00" className="form-control border-0 bg-transparent p-0 fw-700 text-dark" readOnly value={total} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProposal