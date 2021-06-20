import { MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Class.css";

function Class({ day, text, semester, idx, info, updateInfo }) {
  const [color, setColor] = useState("Lavender");
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
  const checkMerge = text.split(";");
  let date;
  // semester start dates
  if (semester === 1) {
    const baseDate = new Date(
      new Date("2021-08-09").getTime() + day * 24 * 60 * 60 * 1000
    );
    date = baseDate.toISOString().slice(0, 10);
  } else {
    const baseDate = new Date(
      new Date("2022-01-10").getTime() + day * 24 * 60 * 60 * 1000
    );
    date = baseDate.toISOString().slice(0, 10);
  }

  const splitText = checkMerge[0].split(" ");
  const classCode = splitText[0];
  const classType = splitText[1];
  const classGrp = splitText[2];

  let time, location;
  const wksplit = splitText[3].split("Wk");
  // if text contains "Wk" split by Wk; else no splitting needed
  if (wksplit.length > 1) {
    time = wksplit[0].slice(-11, -1);
    location = wksplit[0].slice(0, -11);
  } else {
    time = splitText[3].slice(-10);
    location = splitText[3].slice(0, -10);
  }
  const beginning = time.split("to")[0];
  const end = time.split("to")[1];
  const startTime = `${date}T${beginning.slice(0, 2)}:${beginning.slice(
    2
  )}:00+00:00`;
  const endTime = `${date}T${end.slice(0, 2)}:${end.slice(2)}:00+00:00`;

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
  };

  function handleColorChange(e) {
    setColor(e.target.value);
    const copy = Array.from(info);
    const itemcopy = copy[idx - 1];
    copy[idx - 1] = {
      ...itemcopy,
      colorId: (colorIdList.indexOf(e.target.value) + 1).toString(),
    };
    updateInfo(copy);
  }

  useEffect(() => {
    updateInfo((prev) => [...prev, data]);
  }, []);

  return (
    <div className={`cell ${color}`}>
      <p>{text}</p>
      <Select
        disableUnderline
        value={color}
        onChange={handleColorChange}
        variant="filled"
      >
        <MenuItem value="Lavender">
          <div
            style={{ backgroundColor: "#7986cb" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Sage">
          <div
            style={{ backgroundColor: "#33b679" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Grape">
          <div
            style={{ backgroundColor: "#8e24aa" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Flamingo">
          <div
            style={{ backgroundColor: "#e67c73" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Banana">
          <div
            style={{ backgroundColor: "#f6c026" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Tangerine">
          <div
            style={{ backgroundColor: "#f5511d" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Peacock">
          <div
            style={{ backgroundColor: "#039be5" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Graphite">
          <div
            style={{ backgroundColor: "#616161" }}
            class="colorButtons"
          ></div>
        </MenuItem>
        <MenuItem value="Blueberry">
          <div
            style={{ backgroundColor: "#3f51b5" }}
            class="colorButtons"
          ></div>
        </MenuItem>
      </Select>
    </div>
  );
}

export default Class;
