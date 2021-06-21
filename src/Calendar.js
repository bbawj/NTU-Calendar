import React, { useState } from "react";
import "./Calendar.css";
import Class from "./Class";
import SendCalendar from "./SendCalendar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useAuth } from "./context/AuthContext";

function Calendar() {
  const [semester, setSemester] = useState(1);
  const { isLoggedIn, classInfo, table } = useAuth();
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  //track actual index of each object within [classInfo]
  let i = 0;
  return (
    <div>
      {isLoggedIn && classInfo && !(classInfo.length === 0) && (
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
                  // if text contains merged classes return multiple class
                  if (cell.split(";").length > 2) {
                    const elArray = [];
                    for (let x = 0; x < cell.split(";").length - 1; x++) {
                      i = i + 1;
                      const currText = cell.split(";")[x];
                      elArray.push(
                        <Class
                          day={key - 1}
                          text={currText}
                          key={i}
                          semester={semester}
                          idx={i}
                          deleteProps={{ key: key, idx: idx }}
                        />
                      );
                    }
                    return elArray;
                  }
                  i = i + 1;
                  return (
                    <Class
                      day={key - 1}
                      text={cell.slice(0, -1)}
                      key={idx}
                      semester={semester}
                      idx={i}
                      deleteProps={{ key: key, idx: idx }}
                    />
                  );
                }
                return <div></div>;
              })}
            </div>
          ))}
        </div>
      )}
      {classInfo.length === 0 && (
        <div className="demoImage">
          <div>
            <img
              src="https://github.com/bbawj/NTU-Calendar/raw/main/src/img/demo.png"
              alt="demo"
            />
            <p>
              Grab HTML file of your calendar from{" "}
              <a href="https://wish.wis.ntu.edu.sg/pls/webexe/ldap_login.login?w_url=https://wish.wis.ntu.edu.sg/pls/webexe/aus_stars_planner.main">
                STARS
              </a>
            </p>
          </div>
          <div>
            <img
              src="https://github.com/bbawj/NTU-Calendar/raw/main/src/img/demo3.png"
              alt="demo"
            />
            <p>Upload and sync to Google Calendar!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
