import React from "react";
import "./Calendar.css";

function Calendar({ table }) {
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  return (
    <div className="calendar">
      {Object.entries(table).map(([key, value]) => (
        <div className={`col`} key={key}>
          <h2>{days[key - 1]}</h2>
          {value.map((cell, idx) => {
            if (cell && cell !== "span") {
              return <div className={`cell${idx}`}>{cell}</div>;
            }
            return <div></div>;
          })}
        </div>
      ))}
    </div>
  );
}

export default Calendar;
