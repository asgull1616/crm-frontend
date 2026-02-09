'use client';

import { useState } from 'react';
import { leavesService } from '@/lib/services/leaves.service';

const LeaveRequestCard = () => {
  const [type, setType] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');

  const disabled = !type || !start || !end;

const handleSubmit = async () => {
  try {
    await leavesService.create({
      type,
      start,
      end,
      note,
    });

    // formu temizle
    setType('');
    setStart('');
    setEnd('');
    setNote('');

    // 🔥 BURASI ÇOK ÖNEMLİ
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('leave-created'));
    }
  } catch (e) {
    console.error('İzin oluşturulamadı', e);
  }
};

  return (
    <div
      className="card h-100"
      style={{
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 6px 24px rgba(0,0,0,.04)',
      }}
    >
      <div className="card-body">

        {/* HEADER */}
        <h5 className="mb-3 fw-semibold">Yeni İzin Talebi</h5>
        <div className="section-divider" />

        {/* İZİN TÜRÜ */}
        <div className="mb-3">
          <label
            className="form-label"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            İzin Türü
          </label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            <option value="">Seçiniz</option>
            <option value="annual">Yıllık</option>
            <option value="excuse">Mazeret</option>
            <option value="sick">Hastalık</option>
          </select>
        </div>

        {/* TARİHLER */}
        <div className="row">
          <div className="col-6 mb-3">
            <label
              className="form-label"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Başlangıç
            </label>
            <input
              type="date"
              className="form-control"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{
                borderRadius: 10,
                fontSize: 14,
              }}
            />
          </div>

          <div className="col-6 mb-3">
            <label
              className="form-label"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Bitiş
            </label>
            <input
              type="date"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                borderRadius: 10,
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* AÇIKLAMA */}
        <div className="mb-4">
          <label
            className="form-label"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Açıklama (opsiyonel)
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              borderRadius: 10,
              fontSize: 14,
              resize: 'vertical',
              minHeight: 90,
            }}
          />
        </div>

        {/* SUBMIT */}
        <button
          className="btn w-100 text-white"
          disabled={disabled}
          onClick={handleSubmit}
          style={{
            backgroundColor: '#E92B63',
            borderColor: '#E92B63',
            borderRadius: 10,
            padding: '10px 16px',
            fontWeight: 600,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          İzin Talebi Gönder
        </button>

      </div>
    </div>
  );
};

export default LeaveRequestCard;
