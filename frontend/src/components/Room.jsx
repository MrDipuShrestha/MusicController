import React from "react";
import { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";

import {
  setVotesToSkip,
  setError,
  setGuestCanPause,
  setIsHost,
  setShowSetting,
  setSpotifyAuthenticated,
  resetRoom,
} from "../features/room/roomSlice";
import CreateRoomPage from "./CreateRoomPage";

export default function Room() {
  const { roomCode } = useParams();
  const votesToSkip = useSelector((state) => state.room.votesToSkip);
  const guestCanPause = useSelector((state) => state.room.guestCanPause);
  const isHost = useSelector((state) => state.room.isHost);
  const error = useSelector((state) => state.room.error);
  const setting = useSelector((state) => state.room.showSetting);
  // const spotifyAuthenticated = useSelector(
  //   (state) => state.room.spotifyAuthenticated
  // );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasAuthenticatedRef = useRef(false);

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
          if (data.is_host !== isHost) {
            dispatch(setIsHost(data.is_host));
          }
        } else {
          dispatch(setError(data.error));
          navigate("/");
        }

        if (isHost) {
          authenticateSpotify();
        }
      } catch (error) {
        dispatch(setError("Couldn't find room. Please create a room."));
      }
    };

    fetchRoomData();
  }, [roomCode, dispatch, isHost, navigate]);

  useEffect(() => {
    if (isHost && !hasAuthenticatedRef.current) {
      hasAuthenticatedRef.current = true;
      authenticateSpotify();
    }
  }, [isHost]);

  const authenticateSpotify = async () => {
    console.log("Function called");

    // Fetching authentication status
    const authResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/spotify/is-authenticated`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const authData = await authResponse.json(); // Renamed the variable to avoid conflicts

    if (authResponse.ok) {
      dispatch(setSpotifyAuthenticated(authData.status)); // Dispatch the authentication status
      console.log(authData.status); // Logging the status from the first response
    } else {
      console.log("Error in authentication response:", authData);
    }

    // If the user is not authenticated, request the authentication URL
    if (!authData.status) {
      const urlResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/spotify/get-auth-url`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const urlData = await urlResponse.json();

      if (urlResponse.ok) {
        console.log("Redirecting to:", urlData.url);
        window.location.replace(urlData.url);
      } else {
        console.log("Error in fetching URL:", urlData);
      }
    }
  };

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
      dispatch(resetRoom());
      navigate("/");
    } else {
      console.error("Failed to leave the room");
    }
  };

  const handleShowSetting = () => {
    return (
      <Grid size={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(setShowSetting(true))}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderSetting = () => {
    return (
      <Grid container spacing={1}>
        <Grid size={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={() => {}}
          />
        </Grid>
        <Grid size={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(setShowSetting(false))}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  if (setting) {
    return renderSetting();
  }
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
        {isHost ? handleShowSetting() : null}
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
