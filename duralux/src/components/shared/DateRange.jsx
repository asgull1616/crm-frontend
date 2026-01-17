'use client'
import React, { useEffect, useState } from 'react'
import { addDays, endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { tr } from 'date-fns/locale'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DefinedRange } from 'react-date-range';

const DateRange = ({ toggleDateRange, setToggleDateRange }) => {
    const [state, setState] = useState([
        {
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
            key: "selection",
        },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const predefinedRanges = [
        {
            label: 'Bugün',
            range: () => ({
                startDate: new Date(),
                endDate: new Date(),
            }),
            isSelected: (range) => isSameDay(range.startDate, new Date()) && isSameDay(range.endDate, new Date())
        },
        {
            label: 'Dün',
            range: () => ({
                startDate: addDays(new Date(), -1),
                endDate: addDays(new Date(), -1),
            }),
            isSelected: (range) => isSameDay(range.startDate, addDays(new Date(), -1)) && isSameDay(range.endDate, addDays(new Date(), -1))
        },
        {
            label: 'Bu Hafta',
            range: () => ({
                startDate: addDays(new Date(), -new Date().getDay()),
                endDate: addDays(new Date(), 6 - new Date().getDay()),
            }),
            isSelected: (range) => isSameDay(range.startDate, addDays(new Date(), -new Date().getDay())) && isSameDay(range.endDate, addDays(new Date(), 6 - new Date().getDay()))
        },
        {
            label: 'Geçen Hafta',
            range: () => ({
                startDate: addDays(new Date(), -new Date().getDay() - 7),
                endDate: addDays(new Date(), -new Date().getDay() - 1),
            }),
            isSelected: (range) => isSameDay(range.startDate, addDays(new Date(), -new Date().getDay() - 7)) && isSameDay(range.endDate, addDays(new Date(), -new Date().getDay() - 1))
        },
        {
            label: 'Bu Ay',
            range: () => ({
                startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            }),
            isSelected: (range) => isSameDay(range.startDate, new Date(new Date().getFullYear(), new Date().getMonth(), 1)) && isSameDay(range.endDate, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
        },
        {
            label: 'Geçen Ay',
            range: () => ({
                startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
            }),
            isSelected: (range) => isSameDay(range.startDate, new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)) && isSameDay(range.endDate, new Date(new Date().getFullYear(), new Date().getMonth(), 0))
        },
        {
            label: 'Özel Tarih',
            range: () => {
                setShowDatePicker(true);
                return {
                    startDate: state[0].startDate,
                    endDate: state[0].endDate,
                };
            },
            isSelected: () => showDatePicker
        },
    ]

    useEffect(() => {
        document.querySelectorAll(".rdrMonthName")[0]?.classList?.add("rdrMonthNameFirst")
        document.querySelectorAll(".rdrMonthName")[1]?.classList?.add("rdrMonthNameSecond")
    }, [showDatePicker, toggleDateRange])

    const handlePropagation = (event) => {
        event.stopPropagation();
    };


    return (
        <>
            <span>
                {`${format(state[0].startDate, "dd MMM yy", { locale: tr })} - ${format(state[0].endDate, "dd MMM yy", { locale: tr })}`}
            </span>
            {
                toggleDateRange &&

                <div onClick={handlePropagation} className='bg-white date-range-labels' >
                    <DefinedRange
                        ranges={state}
                        onChange={item => {
                            setState([item.selection]);
                          }}
                        staticRanges={predefinedRanges}
                        inputRanges={[]}
                        className='range-dropdown'
                        locale={tr}
                    />
                    {
                        showDatePicker && (
                            <div className='date-dropdown'>
                                <DateRangePicker
                                    onChange={item => {
                                        setState([item.selection]);
                                        // setShowDatePicker(false);
                                    }}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    months={2}
                                    ranges={state}
                                    direction="horizontal"
                                    weekdayDisplayFormat='EEEEEE'
                                    showMonthAndYearPickers={false}
                                    staticRanges={predefinedRanges}
                                    locale={tr}
                                />
                                <div className='action-btns'>
                                    <span>{`${format(state[0].startDate, "dd.MM.yy", { locale: tr })} - ${format(state[0].endDate, "dd.MM.yy", { locale: tr })}`}</span>
                                    <button onClick={() => setToggleDateRange(false)} className='applyBtn btn btn-sm btn-danger'>İptal</button>
                                    <button onClick={() => setToggleDateRange(false)} className='applyBtn btn btn-sm btn-primary'>Uygula</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            }
        </>
    )
}

export default DateRange
