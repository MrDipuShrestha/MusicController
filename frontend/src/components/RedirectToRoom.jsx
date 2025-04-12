import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import HomePage from "./HomePage";

export default function RedirectToRoom() {
  const roomCode = useSelector((state) => state.room.roomCode);
  return roomCode ? <Navigate to={`/room/${roomCode}`} /> : <HomePage />;
}
