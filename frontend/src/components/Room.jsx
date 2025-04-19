import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";

import {
  setVotesToSkip,
  setError,
  setGuestCanPause,
  setIsHost,
} from "../features/room/roomSlice";

export default function Room() {
  const { roomCode } = useParams();
  const votesToSkip = useSelector((state) => state.room.votesToSkip);
  const guestCanPause = useSelector((state) => state.room.guestCanPause);
  const isHost = useSelector((state) => state.room.isHost);
  const error = useSelector((state) => state.room.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/get-room?code=${roomCode}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          dispatch(setVotesToSkip(data.votes_to_skip));
          dispatch(setGuestCanPause(data.guest_can_pause));
          dispatch(setIsHost(data.is_host));
        } else {
          dispatch(setError(data.error));
          navigate("/");
        }
      } catch (error) {
        dispatch(setError("Couldn't find room. Please create a room."));
      }
    };

    fetchRoomData();
  }, [roomCode, dispatch]);

  const leaveButtonPressed = async () => {
    const requestMethods = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/leave-room`,
      requestMethods
    );

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to leave the room");
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {votesToSkip}
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <Typography variant="h6" component="h6">
            Guest can pause: {guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost.toString()}
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
        <Grid size={12} align="center">
          {error && (
            <Typography variant="h10" style={{ color: "red" }}>
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
