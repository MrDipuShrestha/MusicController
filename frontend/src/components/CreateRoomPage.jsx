import React from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  setError,
  setGuestCanPause,
  setVotesToSkip,
} from "../features/room/roomSlice";

export default function () {
  const votesToSkip = useSelector((state) => state.room.votesToSkip);
  const guestCanPause = useSelector((state) => state.room.guestCanPause);
  const error = useSelector((state) => state.room.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid size={12} align="center">
          <Typography component="h4" variant="h4">
            Create a Room
          </Typography>
        </Grid>
        <Grid size={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup row defaultValue="true" onChange={handleRadioChange}>
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
              onChange={(e) => dispatch(setVotesToSkip(e.target.value))}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
          </FormControl>
        </Grid>
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

        {error && (
          <Grid size={12} align="center">
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
