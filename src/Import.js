import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Button } from "@material-ui/core";
import Calendar from "./Calendar";
import "./Calendar.css";
import { useAuth } from "./context/AuthContext";

function Import() {
  const { isLoggedIn, setTable } = useAuth();
  let spanArr = [];
  let grid, rowVar;
  const handleImport = (event) => {
    let grid16 = {
      1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      4: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      5: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      6: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    };
    let grid32 = {
      1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      4: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      5: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      6: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    };
    const f = event.target.files[0];
    if (f) {
        const r = new FileReader();
        r.onload = function (e) {
          try{
          const contents = e.target.result;
          const parsedDoc = new DOMParser().parseFromString(
            contents,
            "text/html"
          );
          const tableRows = parsedDoc
            .querySelector("table table tbody")
            .querySelectorAll("tr");
          if (tableRows.length === 17){
            grid = grid16
            rowVar = 16
          } else{
            grid = grid32
            rowVar = 31
          }
          createSpan(tableRows);
          // console.log(spanArr);
          spanArr.forEach((item) => {
            grid[item.split(",")[1]][item.split(",")[0]] = "span";
          });
          for (let row = 1; row <= rowVar; row++) {
            let index = 1;
            for (let col = 1; col <= 6; col++) {
              if (grid[col][row] === "span") continue;
              if (tableRows[row].cells[index].innerText.trim()) {
                grid[col][row] = tableRows[row].cells[index].innerText
                  .trim()
                  .replace(/\u21b5/g, "");
              }
              index++;
            }
          }
          setTable(grid);
          }catch(err){
            console.error(err)
            alert("Failed to load file")
          }
        };
        r.readAsText(f);
    } else {
      alert("No file found");
    }
  };
  function createSpan(tableRows) {
    try{
    const spanGroups = [];
    [...tableRows].forEach((row, idx) => {
      if (idx === 0) return null;
      const rowNumber = idx;
      const rowList = row.querySelectorAll("td");
      [...rowList].forEach((cell, idx) => {
        if (idx === 0) return;
        const span = cell.getAttribute("rowspan");
        if (span && span - 1) {
          // for each cell with span, compute offset for column as TD for span not rendered
          let colCorrection = 0; // store the number of cols to correct by for the cell with span
          const grp = []; // store group of spans together

          for (let i = 1; i < span; i++) {
            const spanPos = `${rowNumber + i},${idx}`;
            //check through existing span groups
            for (let idx = 0; idx < spanGroups.length; idx++) {
              let add = 0; // BOOLEAN to determine colCorrection; should only +1 max for each span group
              if (
                spanGroups[idx][0].split(",")[0] !== spanPos.split(",")[0] && // current span cannot be same as the first span in existing groups: classes are side by side no offset needed
                i === 1 // calculate offset on the first span instance
              ) {
                // go through each spanGroup element
                for (let x = 0; x < spanGroups[idx].length; x++) {
                  if (
                    spanGroups[idx][x].split(",")[0] ===
                      spanPos.split(",")[0] && // offset only if same row as existing spans
                    spanGroups[idx][x].split(",")[1] <= spanPos.split(",")[1] // and existing spans are located before the current one
                  ) {
                    add = 1;
                  }
                }
              }
              if (add) {
                colCorrection = colCorrection + 1;
              }
            }
            grp.push(`${rowNumber + i},${idx + colCorrection}`);
            spanArr.push(`${rowNumber + i},${idx + colCorrection}`);
          }
          spanGroups.push(grp);
        }
      });
    });

    }catch(err){
      console.error(err)
        alert("Failed to load file")
    }
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
