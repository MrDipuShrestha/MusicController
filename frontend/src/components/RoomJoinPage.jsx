import React, { useState } from "react";

import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function () {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const nevigate = useNavigate();

  const handleSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/join-room`,
        requestOptions
      );

      const data = await response.json();

      if (response.ok) {
        nevigate(`/room/${roomCode}`);
      } else {
        setError("Room not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <TextField
            error={error}
            variant="outlined"
            type="text"
            label="Code"
            placeholder="Enter the room code"
            value={roomCode}
            helperText={error}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </Grid>
        <Grid size={12} align="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enter Room
          </Button>
        </Grid>
        <Grid size={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
