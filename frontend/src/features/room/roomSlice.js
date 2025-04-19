import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomCode: null,
  votesToSkip: 2,
  guestCanPause: true,
  isHost: true,
  error: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomCode: (state, action) => {
      state.roomCode = action.payload;
    },
    setVotesToSkip: (state, action) => {
      state.votesToSkip = action.payload;
    },
    setGuestCanPause: (state, action) => {
      state.guestCanPause = action.payload;
    },
    setIsHost: (state, action) => {
      state.isHost = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRoomCode,
  setVotesToSkip,
  setGuestCanPause,
  setIsHost,
  setError,
} = roomSlice.actions;
export default roomSlice.reducer;
