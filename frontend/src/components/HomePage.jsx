import React, { useEffect, useState } from "react";
import { Button, Grid, ButtonGroup, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { setRoomCode } from "../features/room/roomSlice";

export default function HomePage() {
  const roomCode = useSelector((state) => state.room.roomCode);
  const error = useSelector((state) => state.room.error);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/user-in-room`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      dispatch(setRoomCode(data.code));
    };
    fetchData();
  }, [dispatch]);
  console.log(roomCode);

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={12} align="center">
          <Typography variant="h3">House Party</Typography>
        </Grid>
        <Grid size={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}
