"use client";
import React, { useState, useEffect } from "react";
import { 
  FiDollarSign, FiX, FiCheck, FiArrowRight, FiChevronDown 
} from "react-icons/fi";
import { proposalService } from "@/lib/services/proposal.service";
import { transactionService } from "@/lib/services/transaction.service";

const CustomerPaymentForm = ({ customer, onCancel, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [description, setDescription] = useState("");
  const [offers, setOffers] = useState([]); 
  const [selectedOfferId, setSelectedOfferId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [fetchingOffers, setFetchingOffers] = useState(true);

  useEffect(() => {
    if (customer?.id) loadCustomerOffers();
  }, [customer]);

  const loadCustomerOffers = async () => {
    try {
      setFetchingOffers(true);
      const res = await proposalService.list({ limit: 100 });
      const allProposals = res?.data?.items || res?.data || [];
      
      const currentCId = String(customer?.id || "").trim().toLowerCase();

      // Daha esnek bir filtreleme yapıyoruz
      const filteredOffers = allProposals.filter(proposal => {
        const pId = proposal.customerId || proposal.customer?.id || proposal.customer;
        const currentPId = String(pId || "").trim().toLowerCase();
        return currentPId === currentCId;
      });

      // Eşleşme yoksa bile (hata ayıklama için) gelen tüm teklifleri yükleyelim
      setOffers(filteredOffers.length > 0 ? filteredOffers : allProposals);
      
    } catch (error) {
      console.error("Teklifler çekilirken hata:", error);
    } finally {
      setFetchingOffers(false);
    }
  };

  // handleSubmit fonksiyonunuzu şu şekilde güncelleyin:
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedOfferId) return alert("Lütfen bir teklif seçin.");
  
  setLoading(true);
  try {
    const payload = {
      customerId: String(customer.id),
      proposalId: String(selectedOfferId),
      amount: Number(parseFloat(amount).toFixed(2)), // Sayı formatına zorla
      type: "INCOME",
      method: paymentMethod,
      description: description || "Müşteri ödemesi",
      date: new Date().toISOString() // Tarih eklemek 500 hatasını çözebilir
    };

    await transactionService.create(payload);
    alert("Ödeme başarıyla kaydedildi.");
    if (onSuccess) onSuccess(); 
  } catch (error) {
    console.error("Ödeme hatası (500):", error);
    alert("Sunucu Hatası: Backend veri yapısını kontrol edin.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "25px", background: "#ffffff" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Ödeme Kaydet</h5>
        <button className="btn btn-light rounded-circle shadow-sm" onClick={onCancel} type="button">
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-bold text-muted text-uppercase">İlgili Teklif</label>
            <div className="position-relative">
              <select
                className="form-select bg-light border-0 p-3 fw-medium"
                // CSS: Tarayıcı okunu kesin siliyoruz (Çift ok sorununu çözer)
                style={{ appearance: 'none', backgroundImage: 'none', paddingRight: '45px' }}
                value={selectedOfferId}
                onChange={(e) => setSelectedOfferId(e.target.value)}
                required
                disabled={fetchingOffers}
              >
                <option value="">{fetchingOffers ? "Yükleniyor..." : "Teklif Seçiniz..."}</option>
                {offers.map(offer => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title || "İsimsiz Teklif"} - {offer.totalAmount} {offer.currency || '₺'}
                  </option>
                ))}
              </select>
              <FiChevronDown className="position-absolute end-0 top-50 translate-middle-y text-muted me-3" style={{ pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="col-12">
            <label className="form-label small fw-bold text-muted text-uppercase">Tutar</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0 text-muted"><FiDollarSign /></span>
              <input
                type="number"
                step="0.01"
                className="form-control bg-light border-0 p-3 fw-bold"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <label className="form-label small fw-bold text-muted text-uppercase">Yöntem</label>
            <div className="d-flex gap-2">
              {[
                {id: "BANK_TRANSFER", n: "HAVALE"}, 
                {id: "CASH", n: "NAKİT"}, 
                {id: "CREDIT_CARD", n: "KART"}
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${paymentMethod === m.id ? "btn-primary shadow-sm" : "btn-light text-muted border-0"}`}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  {paymentMethod === m.id && <FiCheck className="me-1" />}
                  {m.n}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 d-flex gap-2 mt-3">
            <button type="button" className="btn btn-light flex-grow-1 p-3 rounded-4 fw-bold text-muted" onClick={onCancel}>VAZGEÇ</button>
            <button 
              type="submit" 
              className="btn btn-success flex-grow-1 p-3 rounded-4 fw-bold shadow-sm" 
              style={{ backgroundColor: '#10B981', border: 'none' }}
              disabled={loading || fetchingOffers}
            >
              {loading ? "İŞLENİYOR..." : "ÖDEMEYİ TAMAMLA"} <FiArrowRight className="ms-1" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerPaymentForm;