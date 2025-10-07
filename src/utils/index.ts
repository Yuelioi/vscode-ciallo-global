import * as vscode from "vscode";

import { ConfigurationManager } from "../config/ConfigurationManager";
import * as nls from "vscode-nls";
const localize = nls.loadMessageBundle();

export async function removeFolderByPath(
  configManager: ConfigurationManager,
  folderPath: string
) {
  const folders = configManager.getFolders();

  if (!folders.includes(folderPath)) {
    vscode.window.showInformationMessage(
      localize(
        "removeFolder.notInConfig",
        "This folder is not in global configuration."
      )
    );
    return;
  }

  const updatedFolders = folders.filter((f) => f !== folderPath);
  await configManager.updateFolders(updatedFolders);

  vscode.window.showInformationMessage(
    localize(
      "removeFolder.success",
      "Removed folder from configuration: {0}",
      folderPath
    )
  );
}

export async function removeFileByPath(
  configManager: ConfigurationManager,
  filePath: string
) {
  const files = configManager.getFiles();

  if (!files.includes(filePath)) {
    vscode.window.showInformationMessage(
      localize(
        "removeFile.notInConfig",
        "This file path is not in configuration."
      )
    );
    return;
  }

  const updatedFiles = files.filter((f) => f !== filePath);
  await configManager.updateFiles(updatedFiles);

  vscode.window.showInformationMessage(
    localize(
      "removeFile.success",
      "Removed file from configuration: {0}",
      filePath
    )
  );
}
