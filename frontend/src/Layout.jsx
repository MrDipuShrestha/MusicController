import { ClassNames } from "@emotion/react";
import React from "react";

import { Outlet } from "react-router-dom";

export default function layout() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Outlet />
    </div>
  );
}
