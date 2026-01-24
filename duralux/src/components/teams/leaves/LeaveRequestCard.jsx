'use client';

import { useState } from 'react';

const LeaveRequestCard = () => {
  const [type, setType] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    console.log({
      type,
      start,
      end,
      note,
    });
  };

  return (
    <div className="card h-100">
      <div className="card-body">

<h5 className="mb-3">Yeni İzin Talebi</h5>
<div className="section-divider" />

        <div className="mb-3">
          <label className="form-label">İzin Türü</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Seçiniz</option>
            <option value="annual">Yıllık</option>
            <option value="excuse">Mazeret</option>
            <option value="sick">Hastalık</option>
          </select>
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Başlangıç</label>
            <input
              type="date"
              className="form-control"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div className="col-6 mb-3">
            <label className="form-label">Bitiş</label>
            <input
              type="date"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Açıklama (opsiyonel)</label>
          <textarea
            className="form-control"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          disabled={!type || !start || !end}
          onClick={handleSubmit}
        >
          İzin Talebi Gönder
        </button>

      </div>
    </div>
  );
};

export default LeaveRequestCard;
