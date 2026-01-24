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

    const prevMonth = () =>
        setCurrentDate(new Date(year, month - 1));

    const nextMonth = () =>
        setCurrentDate(new Date(year, month + 1));

    return (
        <div className="card">
            {/* HEADER */}
            <div className="card-header d-flex justify-content-between align-items-center">
                <button className="btn btn-light btn-sm" onClick={prevMonth}>
                    ←
                </button>

                <h5 className="mb-0 fw-bold">
                    {monthNames[month]} {year}
                </h5>

                <button className="btn btn-light btn-sm" onClick={nextMonth}>
                    →
                </button>
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
