"use client";

import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

type DesktopDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  describedBy?: string;
};

const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function formatSelectedDate(value: string) {
  const date = fromIsoDate(value);
  return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : "日にちを選ぶ";
}

export function DesktopDatePicker({ value, onChange, invalid, describedBy }: DesktopDatePickerProps) {
  const initialDate = fromIsoDate(value) ?? new Date();
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "Tab") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnKey);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnKey);
    };
  }, [open]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstWeekday + 1;
      return day >= 1 && day <= daysInMonth ? new Date(year, month, day) : null;
    });
  }, [visibleMonth]);

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectDate = (date: Date) => {
    onChange(toIsoDate(date));
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const todayIso = toIsoDate(new Date());

  return (
    <div ref={rootRef} className="desktop-date-picker">
      <button
        ref={triggerRef}
        id="date"
        name="date"
        type="button"
        className="date-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={describedBy}
        data-invalid={invalid ? "true" : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? "" : "is-placeholder"}>{formatSelectedDate(value)}</span>
        <CalendarBlank size={24} weight="light" aria-hidden="true" />
      </button>

      {open && (
        <div className="date-picker-panel" role="dialog" aria-label="予約希望日を選択">
          <div className="date-picker-header">
            <button type="button" aria-label="前の月" onClick={() => changeMonth(-1)}><CaretLeft size={22} aria-hidden="true" /></button>
            <strong aria-live="polite">{visibleMonth.getFullYear()}年 {visibleMonth.getMonth() + 1}月</strong>
            <button type="button" aria-label="次の月" onClick={() => changeMonth(1)}><CaretRight size={22} aria-hidden="true" /></button>
          </div>
          <div className="date-picker-weekdays" aria-hidden="true">
            {weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}
          </div>
          <div className="date-picker-days" role="grid" aria-label={`${visibleMonth.getFullYear()}年${visibleMonth.getMonth() + 1}月`}>
            {calendarDays.map((date, index) => date ? (
              <button
                key={toIsoDate(date)}
                type="button"
                className={`${toIsoDate(date) === value ? "is-selected" : ""} ${toIsoDate(date) === todayIso ? "is-today" : ""}`}
                aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`}
                aria-pressed={toIsoDate(date) === value}
                onClick={() => selectDate(date)}
              >
                {date.getDate()}
              </button>
            ) : <span key={`blank-${index}`} aria-hidden="true" />)}
          </div>
        </div>
      )}
    </div>
  );
}
