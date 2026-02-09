'use client'

export default function MonthPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
}) {
  return (
    <div className="d-flex gap-2">
      <select
        className="form-select form-select-sm"
        value={month}
        onChange={(e) => onMonthChange(Number(e.target.value))}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}. Ay
          </option>
        ))}
      </select>

      <select
        className="form-select form-select-sm"
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        <option value={2025}>2025</option>
        <option value={2026}>2026</option>
      </select>
    </div>
  )
}
