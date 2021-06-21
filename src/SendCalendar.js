import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";

export default function SendCalendar({ info }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(false);
  const { gapi } = useAuth();
  const seen = new Set();
  //filter any duplicates before sending
  const filteredInfo = info.filter((el) => {
    const duplicate = seen.has(el.summary);
    seen.add(el.summary);
    return !duplicate;
  });
  async function handleConfirm() {
    try {
      setLoading(true);
      //create new calendar
      const res = await gapi.client.request({
        path: "https://www.googleapis.com/calendar/v3/calendars",
        method: "POST",
        body: {
          summary: "NTU Calendar",
          timeZone: "Asia/Singapore",
        },
      });
      // create events on new calendar
      const batch = gapi.client.newBatch();
      filteredInfo.forEach((event) => {
        const addEvent = gapi.client.request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${res.result.id}/events`,
          method: "POST",
          body: {
            start: event.start,
            end: event.end,
            summary: event.summary,
            location: event.location,
            colorId: event.colorId,
            recurrence: event.recurrence,
          },
        });
        batch.add(addEvent);
      });
      batch.then((res) => {
        setLoading(false);
        setPopup(true);
        setMessage("Successfully updated calendar");
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
      setPopup(true);
      setMessage("Failed to update calendar");
    }
  }

  function handleClose() {
    setPopup(false);
  }
  return (
    <div>
      <Backdrop open={loading} style={{ zIndex: 2 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Snackbar
        onClose={handleClose}
        open={popup}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Button
        style={{ marginLeft: "1em" }}
        color="primary"
        variant="outlined"
        onClick={handleConfirm}
      >
        CONFIRM AND SEND
      </Button>
    </div>
  );
}
