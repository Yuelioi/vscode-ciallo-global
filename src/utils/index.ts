import * as vscode from "vscode";

import { ConfigurationManager } from "../config/ConfigurationManager";
import * as nls from "vscode-nls";
import * as util from "util";
import { exec } from "child_process";

const execPromise = util.promisify(exec);

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

// 资源管理器右键注册配置
export const addToCialloConfigCommand = vscode.commands.registerCommand(
  "ciallo-global.addToCialloConfig",
  async (uri: vscode.Uri) => {
    const configManager = new ConfigurationManager();
    const path = uri.fsPath;

    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.type === vscode.FileType.Directory) {
      // 添加到 folders
      const current = configManager.getFolders();
      if (!current.includes(path)) {
        current.push(path);
        await configManager.updateFolders(current);
        vscode.window.showInformationMessage(
          localize(
            "cmd.addedFolder",
            "📁 Folder added to Ciallo config: {0}",
            path
          )
        );
      } else {
        vscode.window.showWarningMessage(
          localize("cmd.folderExists", "📁 Folder already exists in config")
        );
      }
    } else if (stat.type === vscode.FileType.File) {
      // 添加到 files
      const current = configManager.getFiles();
      if (!current.includes(path)) {
        current.push(path);
        await configManager.updateFiles(current);
        vscode.window.showInformationMessage(
          localize("cmd.addedFile", "📄 File added to Ciallo config: {0}", path)
        );
      } else {
        vscode.window.showWarningMessage(
          localize("cmd.fileExists", "📄 File already exists in config")
        );
      }
    } else {
      vscode.window.showWarningMessage(
        localize("cmd.invalidTarget", "❓ Not a valid file or folder")
      );
    }
  }
);

// 尝试打开远程git仓库

export async function openGitRemote(folderPath: string) {
  try {
    // 检查该目录是否在 Git 仓库中
    const { stdout: gitRoot } = await execPromise(
      "git rev-parse --show-toplevel",
      { cwd: folderPath }
    );

    // 获取远程地址
    const { stdout: remoteUrl } = await execPromise(
      "git remote get-url origin",
      { cwd: gitRoot.trim() }
    );

    const cleanedUrl = remoteUrl
      .trim()
      .replace(/^git@([^:]+):/, "https://$1/") // ssh -> https
      .replace(/\.git$/, "");

    vscode.window.showInformationMessage(`🌐 Opening: ${cleanedUrl}`);

    vscode.env.openExternal(vscode.Uri.parse(cleanedUrl));
  } catch (err: any) {
    vscode.window.showWarningMessage(
      `⚠️ Not a Git repository or no remote found`
    );
    console.error("openGitRemote error:", err);
  }
}
