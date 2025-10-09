import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

function CountdownTimer({ seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <Typography variant="subtitle2" component="div" sx={{ fontWeight: "bold" }}>
      {days}d {hours.toString().padStart(2, "0")}h :{" "}
      {minutes.toString().padStart(2, "0")}m :{" "}
      {secs.toString().padStart(2, "0")}s
    </Typography>
  );
}

export default CountdownTimer;
