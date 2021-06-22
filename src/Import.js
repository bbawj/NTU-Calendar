import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Button } from "@material-ui/core";
import Calendar from "./Calendar";
import "./Calendar.css";
import { useAuth } from "./context/AuthContext";

function Import() {
  const { isLoggedIn, setTable } = useAuth();
  let spanArr = [];

  const handleImport = (event) => {
    let grid = {
      1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      4: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      5: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      6: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    };
    const f = event.target.files[0];
    if (f) {
      try {
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
          console.log(spanArr);
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
      } catch (err) {
        console.error(err);
        alert("Failed to load file");
      }
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
          // for each cell with span,
          let colCorrection = 0; // store the number of cols to correct by for the cell with span
          for (let i = 1; i < span; i++) {
            const spanPos = `${rowNumber + i},${idx}`;
            //check through existing spans
            for (let idx = 0; idx < spanArr.length; idx++) {
              if (
                // see if prev span on same row, && <= column && must be the first span cell to add offset due to no cell index for spans
                spanArr[idx].split(",")[0] === spanPos.split(",")[0] &&
                spanArr[idx].split(",")[1] <= spanPos.split(",")[1] &&
                i === 1
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
    <div style={{ width: "100%" }}>
      {isLoggedIn && (
        <div className="uploadButton">
          <Button
            variant="contained"
            color="primary"
            onClick={() => document.getElementById("importCalendar").click()}
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
        </div>
      )}
      <input
        id="importCalendar"
        hidden="hidden"
        type="file"
        onChange={handleImport}
      />
      <Calendar />
    </div>
  );
}

export default Import;
