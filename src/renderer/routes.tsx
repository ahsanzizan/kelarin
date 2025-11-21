import { Route } from "react-router-dom";

import { Router } from "lib/electron-router-dom";

import { MainScreen } from "./screens/main";
import { PrivacyScreen } from "./screens/privacy";

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route element={<MainScreen />} path="/" />
          {/* Test the Routing */}
          <Route element={<PrivacyScreen />} path="/privacy" />
        </>
      }
    />
  );
}
