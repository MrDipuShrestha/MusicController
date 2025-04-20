import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomCode: null,
  votesToSkip: 2,
  guestCanPause: true,
  isHost: true,
  error: "",
  showSetting: false,
  spotifyAuthenticated: false,
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
    setShowSetting: (state, action) => {
      state.showSetting = action.payload;
    },
    setSpotifyAuthenticated: (state, action) => {
      state.spotifyAuthenticated = action.payload;
    },
    resetRoom: () => initialState,
  },
});

export const {
  setRoomCode,
  setVotesToSkip,
  setGuestCanPause,
  setIsHost,
  setError,
  setShowSetting,
  setSpotifyAuthenticated,
  resetRoom,
} = roomSlice.actions;
export default roomSlice.reducer;
