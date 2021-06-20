import React, { useState } from "react";
import "./Calendar.css";
import Class from "./Class";
import SendCalendar from "./SendCalendar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useAuth } from "./context/AuthContext";
import DemoImage from "./img/demo2.png";

function Calendar({ table }) {
  const [classInfo, setClassInfo] = useState([]);
  const [semester, setSemester] = useState(1);
  const { isLoggedIn } = useAuth();
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  console.log(classInfo);
  let i = 0;
  return (
    <div>
      {isLoggedIn && classInfo && classInfo.length && (
        <div className="calendarHeader">
          <h2>Semester:</h2>
          <Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
          </Select>
          <SendCalendar info={classInfo} />
        </div>
      )}

      {isLoggedIn && (
        <div className="calendar">
          {Object.entries(table).map(([key, value]) => (
            <div className={`col`} key={key}>
              <h2>{days[key - 1]}</h2>
              {value.map((cell, idx) => {
                if (cell && cell !== "span") {
                  i = i + 1;
                  return (
                    <Class
                      day={key - 1}
                      text={cell}
                      key={idx}
                      semester={semester}
                      idx={i}
                      info={classInfo}
                      updateInfo={setClassInfo}
                    />
                  );
                }
                return <div></div>;
              })}
            </div>
          ))}
        </div>
      )}
      {classInfo.length === 0 && <img src={DemoImage} alt="demo" />}
    </div>
  );
}

export default Calendar;
