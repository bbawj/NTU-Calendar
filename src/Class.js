import { MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Class.css";
import { useAuth } from "./context/AuthContext";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

function Class({ day, text, semester, idx, deleteProps }) {
  const [color, setColor] = useState("Lavender");
  const { classInfo, setClassInfo, table, setTable } = useAuth();
  const colorIdList = [
    "Lavender",
    "Sage",
    "Grape",
    "Flamingo",
    "Banana",
    "Tangerine",
    "Peacock",
    "Graphite",
    "Blueberry",
    "Basil",
    "Tomato",
  ];
  // const checkMerge = text.split(";");
  let date, semDate;
  // semester start date
  if (semester === 1) {
    semDate = "2021-08-09";
  } else {
    semDate = "2021-01-10";
  }

  const splitText = text.split(" ");
  const classCode = splitText[0];
  const classType = splitText[1];
  const classGrp = splitText[2];

  let time, location, recurrence;
  const wksplit = splitText[3].split("Wk");
  // if text contains "Wk" split by Wk; else no splitting needed
  if (wksplit.length > 1) {
    time = wksplit[0].slice(-11, -1);
    location = wksplit[0].slice(0, -11);
    // get the date and recurrence
    // Wk2-13
    if (wksplit[1].split("-").length > 1) {
      const hyphenSplitted = wksplit[1].split("-");
      const startWeek = Number(hyphenSplitted[0]);
      const endWeek = Number(hyphenSplitted[1]);
      const baseDate = new Date(
        new Date(semDate).getTime() +
          day * 24 * 60 * 60 * 1000 +
          (startWeek - 1) * 7 * 24 * 60 * 60 * 1000
      );
      date = baseDate.toISOString().slice(0, 10);
      recurrence = [`RRULE:FREQ=WEEKLY;COUNT=${endWeek - startWeek + 1}`];
    } else {
      //week intervals Wk2,4,6,8
      const commaSplitted = wksplit[1].split(",");
      const startWeek = Number(commaSplitted[0]);
      const interval = Number(commaSplitted[1]) - startWeek;

      const baseDate = new Date(
        new Date(semDate).getTime() +
          day * 24 * 60 * 60 * 1000 +
          (startWeek - 1) * 7 * 24 * 60 * 60 * 1000
      );
      date = baseDate.toISOString().slice(0, 10);
      recurrence = [
        `RRULE:FREQ=WEEKLY;INTERVAL=${interval};COUNT=${commaSplitted.length}`,
      ];
    }
  } else {
    time = splitText[3].slice(-10);
    location = splitText[3].slice(0, -10);
    const baseDate = new Date(
      new Date(semDate).getTime() + day * 24 * 60 * 60 * 1000
    );
    date = baseDate.toISOString().slice(0, 10);
    recurrence = ["RRULE:FREQ=WEEKLY;COUNT=13"];
  }
  const beginning = time.split("to")[0];
  const end = time.split("to")[1];
  const startTime = `${date}T${beginning.slice(0, 2)}:${beginning.slice(2)}:00`;
  const endTime = `${date}T${end.slice(0, 2)}:${end.slice(2)}:00`;

  const data = {
    summary: `${classCode} ${classType} ${classGrp}`,
    location: location,
    start: {
      dateTime: startTime,
      timeZone: "Asia/Singapore",
    },
    end: {
      dateTime: endTime,
      timeZone: "Asia/Singapore",
    },
    colorId: "1",
    recurrence: recurrence,
  };

  function handleColorChange(e) {
    setColor(e.target.value);
    const copy = Array.from(classInfo);
    const itemcopy = copy[idx - 1];
    copy[idx - 1] = {
      ...itemcopy,
      colorId: (colorIdList.indexOf(e.target.value) + 1).toString(),
    };
    setClassInfo(copy);
  }

  useEffect(() => {
    setClassInfo((prev) => [...prev, data]);
  }, []);

  return (
    <div className={`cell ${color}`}>
      <p>{text}</p>
      <div className="selectContainer">
        <Select
          disableUnderline
          value={color}
          onChange={handleColorChange}
          variant="filled"
        >
          <MenuItem value="Lavender">
            <div
              style={{ backgroundColor: "#7986cb" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Sage">
            <div
              style={{ backgroundColor: "#33b679" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Grape">
            <div
              style={{ backgroundColor: "#8e24aa" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Flamingo">
            <div
              style={{ backgroundColor: "#e67c73" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Banana">
            <div
              style={{ backgroundColor: "#f6c026" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Tangerine">
            <div
              style={{ backgroundColor: "#f5511d" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Peacock">
            <div
              style={{ backgroundColor: "#039be5" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Graphite">
            <div
              style={{ backgroundColor: "#616161" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Blueberry">
            <div
              style={{ backgroundColor: "#3f51b5" }}
              className="colorButtons"
            ></div>
          </MenuItem>
          <MenuItem value="Tomato">
            <div
              style={{ backgroundColor: "#d60000" }}
              className="colorButtons"
            ></div>
          </MenuItem>
        </Select>
      </div>
    </div>
  );
}

export default Class;
