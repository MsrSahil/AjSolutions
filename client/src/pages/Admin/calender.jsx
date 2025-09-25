import React, { useState, useMemo } from "react";

const colors = {
  bg: "bg-[#222831]",
  card: "bg-[#393E46]",
  primary: "#00ADB5",
  text: "text-[#EEEEEE]",
  softText: "text-[#EEEEEE]/70",
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ initialDate = new Date(), onSelectDate, submittedDates = [] }) => {
  const [viewDate, setViewDate] = useState(new Date(initialDate));
  const [selected, setSelected] = useState(null);

  // helpers
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const daysInMonth = (d) => endOfMonth(d).getDate();

  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
    onSelectDate?.(now);
  };

  const grid = useMemo(() => {
    const start = startOfMonth(viewDate);
    const startWeekday = start.getDay(); // 0-6
    const totalDays = daysInMonth(viewDate);

    const cells = [];

    // previous month's trailing days
    if (startWeekday > 0) {
      const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      const prevDays = daysInMonth(prev);
      for (let i = startWeekday - 1; i >= 0; i--) {
        const dayNum = prevDays - i;
        cells.push({
          date: new Date(prev.getFullYear(), prev.getMonth(), dayNum),
          inMonth: false,
        });
      }
    }

    // current month days
    for (let d = 1; d <= totalDays; d++) {
      cells.push({
        date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d),
        inMonth: true,
      });
    }

    // next month's leading days to fill rows
    while (cells.length % 7 !== 0) {
      const nextIndex = cells.length - (startWeekday + totalDays);
      const dt = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + 1,
        nextIndex + 1
      );
      cells.push({ date: dt, inMonth: false });
    }

    return cells;
  }, [viewDate]);

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today = new Date();

  return (
    <div className={`${colors.bg} ${colors.text} rounded-lg p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-[#EEEEEE]/80">
            {viewDate.toLocaleString("default", { month: "long" })}{" "}
            {viewDate.getFullYear()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="px-2 py-1 rounded hover:bg-[#2E2E2E]"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1 rounded text-sm font-medium"
            style={{ background: colors.card }}
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="px-2 py-1 rounded hover:bg-[#2E2E2E]"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday names */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {WEEK_DAYS.map((w) => (
          <div key={w} className={`text-xs font-semibold ${colors.softText}`}>
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {grid.map((cell, idx) => {
          const date = cell.date;
          const inMonth = cell.inMonth;
          const selectedDay = isSameDay(selected, date);
          const isToday = isSameDay(today, date);

          const dateString = date.toDateString();
          let mark = null;

          if (submittedDates.includes(dateString)) {
            mark = <span className="text-green-500 font-bold">✔</span>;
          } else if (date < new Date().setHours(0, 0, 0, 0)) {
            mark = <span className="text-red-500 font-bold">✘</span>;
          }

          return (
            <button
              key={idx}
              onClick={() => {
                setSelected(date);
                onSelectDate?.(date);
              }}
              className={`
                w-full aspect-square rounded-md flex flex-col items-center justify-center
                text-sm
                ${inMonth ? "opacity-100" : "opacity-50"}
                ${selectedDay ? "ring-2 ring-offset-1" : ""}
                ${isToday && !selectedDay ? "border border-[#00ADB5]" : ""}
                hover:bg-[#2E2E2E] transition
              `}
              style={{
                background: selectedDay ? colors.primary : undefined,
                color: selectedDay ? "#222831" : undefined,
              }}
              title={date.toDateString()}
            >
              <span className={`${selectedDay ? "font-semibold" : ""}`}>
                {date.getDate()}
              </span>
              {mark && <div>{mark}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
