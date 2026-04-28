import React from "react";

const days = Array.from({ length: 30 }, (_, i) => i + 1);

export default function Calendar({ markAttendance }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
      {days.map((day) => (
        <div
          key={day}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <p>{day}</p>

          <button onClick={() => markAttendance(day, "present")}>🟢</button>
          <button onClick={() => markAttendance(day, "absent")}>🔴</button>
        </div>
      ))}
    </div>
  );
}