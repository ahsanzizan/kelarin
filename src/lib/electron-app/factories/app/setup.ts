import { app, BrowserWindow, ipcMain } from "electron";

import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-extension-installer";

import { ignoreConsoleWarnings } from "../../utils/ignore-console-warnings";
import { PLATFORM, ENVIRONMENT } from "shared/constants";
import { makeAppId } from "shared/utils";

ignoreConsoleWarnings(["Manifest version 2 is deprecated"]);

export async function makeAppSetup(createWindow: () => Promise<BrowserWindow>) {
  if (ENVIRONMENT.IS_DEV) {
    await installExtension([REACT_DEVELOPER_TOOLS], {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
  }

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
  ipcMain.on("switch-to-sticky-mode", () => {
    if (!window) return;
    window.setAlwaysOnTop(true, "screen-saver");
    window.setSize(320, 420);
    window.setMinimumSize(250, 300);
    window.setResizable(true);
    window.setSkipTaskbar(true);
  });

  ipcMain.on("switch-to-general-mode", () => {
    if (!window) return;
    window.setAlwaysOnTop(false);
    window.setSize(1024, 700);
    window.setMinimumSize(600, 400);
    window.setResizable(true);
    window.setSkipTaskbar(false);
  });

  return window;
}

PLATFORM.IS_LINUX && app.disableHardwareAcceleration();

PLATFORM.IS_WINDOWS &&
  app.setAppUserModelId(ENVIRONMENT.IS_DEV ? process.execPath : makeAppId());

app.commandLine.appendSwitch("force-color-profile", "srgb");
