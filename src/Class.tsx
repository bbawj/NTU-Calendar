import { MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Class.css";

interface Data {
  summary: string
  location: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  colorId: string
  recurrence: string[] | undefined
}

function Class({day, text, semDate, classInfo, setClassInfo}: { day: number, text: string, semDate: string, classInfo: Data[], setClassInfo: any }) {
  const [color, setColor] = useState("Lavender");
  const [summary, setSummary] = useState("");
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

  function computeData(day: number, text: string, semester: any, color: any): Data[] {
    let date;

    const splitText = text.split(" ");
    const classCode = splitText[0];
    const classType = splitText[1];
    const classGrp = splitText[2];
    console.log(text)
    setSummary(`${classCode} ${classType} ${classGrp}`);

    let data: Data[] = [];

    let time: string,
      location: string,
      recurrence: string[] = [],
      exception,
      baseDate,
      recessDate,
      recessRecurrence;
    const wksplit = splitText[splitText.length - 1].split("Wk");
    // if text contains "Wk" split by Wk; else no splitting needed
    if (wksplit.length > 1) {
      time = wksplit[0].slice(-11, -1);
      location = wksplit[0].slice(0, -11);
      const weeks = wksplit[1]
      // get the date and recurrence
      if (weeks.includes(",")) {
        //week intervals Wk2,4,6,8
        let commaSplitted = wksplit[1].split(",");
        let hyphenSplitted: string[] = []
        for (let i = commaSplitted.length - 1; i >= 0; i--) {
          const split = commaSplitted[i]
          if (split.includes("-")) {
             hyphenSplitted = hyphenSplitted.concat(commaSplitted.splice(i, 1))
          }
        }

        console.log(hyphenSplitted)
        for (const split of hyphenSplitted) {
          console.log(split)
          let temp = [...splitText]
          let time = temp[temp.length - 1].split("Wk")[0];
          temp[temp.length - 1] = `${time}Wk${split}`
          const s = temp.join(" ")
          data = data.concat(computeData(day, s, semester, color))
        }

        const startWeek = Number(commaSplitted[0]);
        const interval = Number(commaSplitted[1]) - startWeek;
        //interval contains a week after recess week
        let flag = -1;
        for (let i = 0; i < commaSplitted.length; i++) {
          if (Number(commaSplitted[i]) > 7) {
            flag = i;
            exception = "interval";
            break;
          }
        }
        let postRecessWeek: string[] = [];

        if (flag !== -1) {
          postRecessWeek = commaSplitted.slice(flag);
          const postRecessBaseDate = new Date(
            new Date(semDate).getTime() +
              day * 24 * 60 * 60 * 1000 +
              parseInt(postRecessWeek[0]) * 7 * 24 * 60 * 60 * 1000
          );
          recessDate = postRecessBaseDate.toISOString().slice(0, 10);
          recessRecurrence = [
            `RRULE:FREQ=WEEKLY;INTERVAL=${interval};COUNT=${postRecessWeek.length}`,
          ];
        }

        baseDate = new Date(
          new Date(semDate).getTime() +
            day * 24 * 60 * 60 * 1000 +
            (startWeek - 1) * 7 * 24 * 60 * 60 * 1000
        );
        date = baseDate.toISOString().slice(0, 10);
        recurrence = [
          `RRULE:FREQ=WEEKLY;INTERVAL=${interval};COUNT=${
            commaSplitted.length - postRecessWeek.length
          }`,
        ];
      } else if (weeks.includes("-")) {
        // Wk2-13
        const hyphenSplitted = weeks.split("-");
        const startWeek = Number(hyphenSplitted[0]);
        let endWeek = Number(hyphenSplitted[1]);
        //ignore recess week and hence +1 to endWeek
        if (endWeek > 7) {
          endWeek++;
          exception = "range";
        }
        baseDate = new Date(
          new Date(semDate).getTime() +
            day * 24 * 60 * 60 * 1000 +
            (startWeek - 1) * 7 * 24 * 60 * 60 * 1000
        );
        date = baseDate.toISOString().slice(0, 10);
        recurrence = [`RRULE:FREQ=WEEKLY;COUNT=${endWeek - startWeek + 1}`];
      } 
    } else {
      //no Wk in text means class every week
      time = splitText[splitText.length - 1].slice(-10);
      location = splitText[splitText.length - 1].slice(0, -10);
      baseDate = new Date(
        new Date(semDate).getTime() + day * 24 * 60 * 60 * 1000
      );
      date = baseDate.toISOString().slice(0, 10);
      exception = "every";
      recurrence = ["RRULE:FREQ=WEEKLY;COUNT=14"];
    }

    const beginning = time.split("to")[0];
    const end = time.split("to")[1];
    const startTime = `${date}T${beginning.slice(0, 2)}:${beginning.slice(
      2
    )}:00`;
    const endTime = `${date}T${end.slice(0, 2)}:${end.slice(2)}:00`;

    const recessStartTime = `${recessDate}T${beginning.slice(
      0,
      2
    )}:${beginning.slice(2)}:00`;
    const recessEndTime = `${recessDate}T${end.slice(0, 2)}:${end.slice(2)}:00`;

    if (exception === "range" || exception === "every") {
      //skip the recess week date
      recessDate = new Date(
        new Date(semDate).getTime() +
          day * 24 * 60 * 60 * 1000 +
          7 * 7 * 24 * 60 * 60 * 1000
      );
      const exceptionWeek = `${recessDate
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reduce((prev, cur) => prev + cur, "")}T${beginning.slice(
        0,
        2
      )}${beginning.slice(2)}00`;

      recurrence.push(`EXDATE;TZID=Asia/Singapore:${exceptionWeek}`);

      data.push({
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
        colorId: (colorIdList.indexOf(color) + 1).toString(),
        recurrence: recurrence,
      });
    } else if (exception === "interval") {
      data.push(
        {
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
          colorId: (colorIdList.indexOf(color) + 1).toString(),
          recurrence: recurrence,
        },
        {
          summary: `${classCode} ${classType} ${classGrp}`,
          location: location,
          start: {
            dateTime: recessStartTime,
            timeZone: "Asia/Singapore",
          },
          end: {
            dateTime: recessEndTime,
            timeZone: "Asia/Singapore",
          },
          colorId: (colorIdList.indexOf(color) + 1).toString(),
          recurrence: recessRecurrence,
        }
      );
    } else {
      data.push({
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
        colorId: (colorIdList.indexOf(color) + 1).toString(),
        recurrence: recurrence,
      });
    }

    return data;
  }

  function handleColorChange(e: any) {
    setColor(e.target.value);
    const copy: Data[] = Array.from(classInfo);
    copy.forEach((obj) => {
      if (obj.summary === summary) {
        obj.colorId = (colorIdList.indexOf(e.target.value) + 1).toString();
      }
    });
    setClassInfo(copy);
  }

  useEffect(() => {
    const computed = computeData(day, text, semDate, color);
    setClassInfo((prev: Data[]) => [...prev, ...computed]);
    return () => {
      setClassInfo([]);
    };
  }, [text, day, semDate]);

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
