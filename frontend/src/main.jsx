import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

import "./index.css";
import App from "./App.jsx";
import Layout from "./Layout.jsx";
import CreateRoomPage from "./components/CreateRoomPage.jsx";
import RoomJoinPage from "./components/RoomJoinPage.jsx";
import Room from "./components/Room.jsx";
import RedirectToRoom from "./components/RedirectToRoom.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<RedirectToRoom />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/join" element={<RoomJoinPage />} />
      <Route path="/room/:roomCode" element={<Room />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
