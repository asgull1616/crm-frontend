const months = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
]

export default function AdminPayrollFilters({
  draftFilters,
  setDraftFilters,
  onApply,
}) {
  return (
    <div className="row g-3 align-items-end mb-3">
      <div className="col-md-3">
        <label className="form-label">Ay</label>
        <select
          className="form-select"
          value={draftFilters.month}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, month: e.target.value })
          }
        >
          <option value="">Tümü</option>
          {months.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      <div className="col-md-2">
        <label className="form-label">Yıl</label>
        <select
          className="form-select"
          value={draftFilters.year}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, year: e.target.value })
          }
        >
          <option value="">Tümü</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Durum</label>
        <select
          className="form-select"
          value={draftFilters.status}
          onChange={(e) =>
            setDraftFilters({ ...draftFilters, status: e.target.value })
          }
        >
          <option value="">Tümü</option>
          <option value="PAID">Ödendi</option>
          <option value="PENDING">Bekliyor</option>
        </select>
      </div>

      <div className="col-md-2 payroll-filters">
        <button
          type="button"
          className="btn btn-primary w-100 "
          onClick={onApply}
        >
          Filtrele
        </button>
      </div>
    </div>
  )
}
