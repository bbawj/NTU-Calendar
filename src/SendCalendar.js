import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";

export default function SendCalendar({ info }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { gapi } = useAuth();
  async function handleConfirm() {
    try {
      setError(false);
      setLoading(true);
      //create new calendar
      const res = await gapi.client.request({
        path: "https://www.googleapis.com/calendar/v3/calendars",
        method: "POST",
        body: {
          summary: "Test Calendar",
          timeZone: "Asia/Singapore",
        },
      });
      console.log(res);
      // create events on new calendar
      const batch = gapi.client.newBatch();
      info.forEach((event) => {
        const addEvent = gapi.client.request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${res.result.id}/events`,
          method: "POST",
          body: {
            start: event.start,
            end: event.end,
            summary: event.summary,
            location: event.location,
            colorId: event.colorId,
          },
        });
        batch.add(addEvent);
      });
      batch.then((res) => {
        console.log(res);
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  }
  return (
    <div>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button onClick={handleConfirm}>CONFIRM AND SEND</Button>
      {error && <p style={{ color: "red" }}>Failed to update calendar.</p>}
    </div>
  );
}
