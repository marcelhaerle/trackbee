"use client";

import { useState } from "react";
import { FaCalendar, FaClock } from "react-icons/fa";

interface DateTimePickerProps {
  initialDate?: Date;
  label: string;
  required?: boolean;
  name: string;
}

export function DateTimePicker({
  initialDate = new Date(),
  label = "Date and Time",
  required = false,
  name = "datetime",
}: DateTimePickerProps) {
  const [date, setDate] = useState<string>(
    initialDate.toISOString().split("T")[0]
  );
  const [time, setTime] = useState<string>(
    initialDate.toTimeString().substring(0, 5)
  );
  const [dateAndTime, setDateAndTime] = useState<string>(
    initialDate.toISOString()
  );

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setDateAndTime(`${e.target.value}T${time}:00`);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    setDateAndTime(`${date}T${e.target.value}:00`);
  };

  return (
    <div className="mb-4">
      <label className="label">
        {label} {required && <span className="has-text-danger">*</span>}
      </label>

      <div className="field has-addons">
        {/* Date Input */}
        <div className="control has-icons-left is-expanded">
          <input
            type="date"
            className="input"
            value={date}
            onChange={handleDateChange}
            required={required}
          />
          <span className="icon is-small is-left">
            <FaCalendar />
          </span>
        </div>

        {/* Time Input */}
        <div className="control has-icons-left">
          <input
            type="time"
            className="input"
            value={time}
            onChange={handleTimeChange}
            required={required}
          />
          <span className="icon is-small is-left">
            <FaClock />
          </span>
        </div>
      </div>

      <input type="hidden" name={name} value={dateAndTime} />

      <style jsx>{`
        .time-picker-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          right: 0;
          width: 150px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }

        .time-option {
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .time-option:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
