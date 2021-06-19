import React, { useState } from "react";
import Calendar from "./Calendar";

function Import() {
  const [table, setTable] = useState({});
  let spanArr = [];

  let grid = {
    1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    4: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    5: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    6: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  };
  const handleImport = (event) => {
    const f = event.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = function (e) {
        const contents = e.target.result;
        const parsedDoc = new DOMParser().parseFromString(
          contents,
          "text/html"
        );
        const tableRows = parsedDoc
          .querySelector("table table tbody")
          .querySelectorAll("tr");
        createSpan(tableRows);
        spanArr.forEach((item) => {
          grid[item.split(",")[1]][item.split(",")[0]] = "span";
        });
        for (let row = 1; row <= 16; row++) {
          let index = 1;
          for (let col = 1; col <= 6; col++) {
            if (grid[col][row] === "span") continue;
            if (tableRows[row].cells[index].innerText.trim()) {
              grid[col][row] = tableRows[row].cells[index].innerText;
            }
            index++;
          }
        }
        setTable(grid);
      };
      r.readAsText(f);
    } else {
      alert("Failed to load file");
    }
  };
  function createSpan(tableRows) {
    [...tableRows].forEach((row, idx) => {
      if (idx === 0) return null;
      const rowNumber = idx;
      const rowList = row.querySelectorAll("td");
      [...rowList].forEach((cell, idx) => {
        if (idx === 0) return;
        const span = cell.getAttribute("rowspan");
        if (span && span - 1) {
          let colCorrection = 0;
          for (let i = 1; i < span; i++) {
            const spanPos = `${rowNumber + i},${idx}`;
            for (let idx = 0; idx < spanArr.length; idx++) {
              if (
                spanArr[idx].split(",")[0] === spanPos.split(",")[0] &&
                spanArr[idx].split(",")[1] <= spanPos.split(",")[1]
              ) {
                colCorrection = colCorrection + 1;
              }
            }
            spanArr.push(`${rowNumber + i},${idx + colCorrection}`);
          }
        }
      });
    });
  }

  return (
    <div>
      <input type="file" onChange={handleImport} />
      <Calendar table={table} />
    </div>
  );
}

export default Import;