import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  setError,
  setGuestCanPause,
  setVotesToSkip,
} from "../features/room/roomSlice";

export default function ({
  update = false,
  votesToSkip: initialVotesToSkip,
  guestCanPause: initialGuestCanPause,
  roomCode,
  updateCallback,
}) {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const votesToSkip = useSelector((state) => state.room.votesToSkip);
  const guestCanPause = useSelector((state) => state.room.guestCanPause);
  const error = useSelector((state) => state.room.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setShowAlert(true);
  };

  const triggerError = (msg) => {
    setSuccessMsg("");
    setErrorMsg(msg);
    setShowAlert(true);
  };

  useEffect(() => {
    if (update) {
      dispatch(setVotesToSkip(Number(initialVotesToSkip)));
      dispatch(setGuestCanPause(initialGuestCanPause));
    }
  }, [update, initialGuestCanPause, initialVotesToSkip, dispatch]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleRadioChange = (e) => {
    dispatch(setGuestCanPause(e.target.value === "true"));
  };

  const handleRoomSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/create-room`,
        requestOptions
      );

      const data = await response.json();

      if (response.ok) {
        navigate(`/room/${data.code}`);
      } else {
        dispatch(setError(data.error));
      }
    } catch (error) {
      console.error("Error creating room:", error);
      dispatch(setError("Error creating room. Please try again."));
    }
  };

  const handleUpdateSubmit = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip,
        code: roomCode,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/update-room`,
        requestOptions
      );

      const data = await response.json();

      if (response.ok) {
        triggerSuccess("Room update successfully..");
      } else {
        triggerError(data.error || "Failed to update..");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      dispatch(setError("Error creating room. Please try again."));
    }
  };

  const renderCreateButton = () => {
    return (
      <Grid container spacing={2}>
        <Grid size={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomSubmit}
          >
            Create a Room
          </Button>
        </Grid>
        <Grid size={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButton = () => {
    return (
      <Grid container spacing={2}>
        <Grid size={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateSubmit}
          >
            Update Room
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid size={12} align="center">
          <Collapse in={showAlert}>
            {successMsg != "" ? (
              <Alert severity="success">{successMsg}</Alert>
            ) : (
              <Alert severity="error">{errorMsg}</Alert>
            )}
          </Collapse>
        </Grid>
        <Grid size={12} align="center">
          <Typography component="h4" variant="h4">
            {update ? "Update a Room" : "Create a Room"}
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              value={guestCanPause.toString()}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid size={12} align="center">
          <FormControl>
            <TextField
              required
              type="number"
              label="Votes required to skip song"
              value={votesToSkip}
              onChange={(e) => dispatch(setVotesToSkip(Number(e.target.value)))}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
          </FormControl>
        </Grid>
        {update ? renderUpdateButton() : renderCreateButton()}
        {error && (
          <Grid size={12} align="center">
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
