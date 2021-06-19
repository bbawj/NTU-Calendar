import React from "react";
import { useAuth } from "./context/AuthContext";

export default function SendCalendar({ info }) {
  const { gapi } = useAuth();
  async function handleConfirm() {
    const res = await gapi.client.request({
      path: "https://www.googleapis.com/calendar/v3/calendars",
      method: "POST",
      body: {
        summary: "Test Calendar",
        timeZone: "Asia/Singapore",
      },
    });
    console.log(res);
  }
  return (
    <div>
      <button onClick={handleConfirm}>CONFIRM AND SEND</button>
    </div>
  );
}
