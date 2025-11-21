import { app, BrowserWindow, ipcMain } from "electron";

import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-extension-installer";

import { runMigrations } from "main/database/migrate";
import { ENVIRONMENT, PLATFORM } from "shared/constants";
import { makeAppId } from "shared/utils";
import { ignoreConsoleWarnings } from "../../utils/ignore-console-warnings";
import { registerAuthIpcHandlers } from "./ipcs/auth.ipc";
import { registerScreenModeIpcHandlers } from "./ipcs/screen-mode.ipc";

ignoreConsoleWarnings(["Manifest version 2 is deprecated"]);

export async function makeAppSetup(createWindow: () => Promise<BrowserWindow>) {
  if (ENVIRONMENT.IS_DEV) {
    await installExtension([REACT_DEVELOPER_TOOLS], {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
  }

  runMigrations();

  let window = await createWindow();

  app.on("activate", async () => {
    const windows = BrowserWindow.getAllWindows();

    if (windows.length) {
      for (window of windows.toReversed()) {
        window.restore();
      }
    } else {
      window = await createWindow();
    }
  });

  app.on("web-contents-created", (_, contents) =>
    contents.on(
      "will-navigate",
      (event, _) => !ENVIRONMENT.IS_DEV && event.preventDefault()
    )
  );

  app.on("window-all-closed", () => !PLATFORM.IS_MAC && app.quit());

  // IPC exposed functions
  registerAuthIpcHandlers();
  registerScreenModeIpcHandlers(window);

  return window;
}

PLATFORM.IS_LINUX && app.disableHardwareAcceleration();

PLATFORM.IS_WINDOWS &&
  app.setAppUserModelId(ENVIRONMENT.IS_DEV ? process.execPath : makeAppId());

app.commandLine.appendSwitch("force-color-profile", "srgb");
