'use client';

import { useState } from 'react';

const leaves = [
    {
        name: 'Ayşegül',
        start: '2026-02-10',
        end: '2026-02-14',
        color: 'bg-danger',
    },
    {
        name: 'Aley',
        start: '2026-02-10',
        end: '2026-02-14',
        color: 'bg-danger',
    },
    {
        name: 'Sude',
        start: '2026-02-10',
        end: '2026-02-14',
        color: 'bg-warning',
    },
    {
        name: 'Sude',
        start: '2026-02-22',
        end: '2026-02-22',
        color: 'bg-warning',
    },
    {
        name: 'Ahmet',
        start: '2026-03-03',
        end: '2026-03-04',
        color: 'bg-primary',
    },
];

const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];

const LeavesCalendar = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Şubat 2026

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = (firstDayOfMonth + 6) % 7;


    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const [showPicker, setShowPicker] = useState(false);
    const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
    const [tempYear, setTempYear] = useState(currentDate.getFullYear());

    const baseYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => baseYear - 5 + i);


    const prevMonth = () =>
        setCurrentDate(new Date(year, month - 1));

    const nextMonth = () =>
        setCurrentDate(new Date(year, month + 1));

    return (
        <div className="card">
            {/* HEADER */}
            <div className="card-header d-flex justify-content-between align-items-center position-relative">
                <button
                    className="btn btn-light btn-sm"
                    onClick={prevMonth}
                    disabled={showPicker}
                >
                 ←
                </button>

                <h5
                    className="mb-0 fw-bold d-flex align-items-center gap-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setTempMonth(month);
                        setTempYear(year);
                        setShowPicker(!showPicker);
                    }}
                >
                    {monthNames[month]} {year}
                    <span style={{ fontSize: 18 }}>↓</span>
                </h5>

                <button
                    className="btn btn-light btn-sm"
                    onClick={nextMonth}
                    disabled={showPicker}
                >
                    →
                </button>{showPicker && (
                    <div
                        className="position-absolute bg-white shadow rounded p-3"
                        style={{
                            top: '60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 20,
                            width: 240,
                        }}
                    >
                        {/* AY */}
                        <div className="mb-2">
                            <label className="form-label small text-muted">Ay</label>
                            <select
                                className="form-select"
                                value={tempMonth}
                                onChange={(e) => setTempMonth(Number(e.target.value))}
                            >
                                {monthNames.map((m, i) => (
                                    <option key={i} value={i}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* YIL */}
                        <div className="mb-3">
                            <label className="form-label small text-muted">Yıl</label>
                            <select
                                className="form-select"
                                value={tempYear}
                                onChange={(e) => setTempYear(Number(e.target.value))}
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* UYGULA */}
                        <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => {
                                setCurrentDate(new Date(tempYear, tempMonth));
                                setShowPicker(false);
                            }}
                        >
                            Uygula 
                        </button>
                    </div>
                )}


            </div>

            {/* BODY */}
            <div className="card-body">
                {/* HAFTA GÜNLERİ */}
                <div className="calendar-weekdays">
                    {weekDays.map(day => (
                        <div key={day} className="weekday">
                            {day}
                        </div>
                    ))}
                </div>

                {/* GÜNLER */}
                <div className="leave-calendar-grid">
                    {/* BOŞ HÜCRELER (AYIN 1'İNDEN ÖNCE) */}
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-cell empty" />
                    ))}

                    {/* AYIN GÜNLERİ */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;

                        const dateObj = new Date(year, month, day);
                        const isSunday = dateObj.getDay() === 0;

                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                        const dayLeaves = leaves.filter(
                            l => dateStr >= l.start && dateStr <= l.end
                        );

                        return (
                            <div
                                key={day}
                                className={`calendar-cell ${isSunday ? 'sunday' : ''}`}
                            >
                                <span className="day-number">{day}</span>

                                {dayLeaves.map((leave, idx) => (
                                    <div
                                        key={idx}
                                        className={`calendar-leave ${leave.color}`}
                                    >
                                        {leave.name}
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                </div>

            </div>
        </div>
    );
};

export default LeavesCalendar;
