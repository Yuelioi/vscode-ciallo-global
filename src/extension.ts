import * as vscode from "vscode";
import {
  FileExplorerProvider,
  ViewMode,
} from "./providers/FileExplorerProvider";
import { ConfigurationManager } from "./config/ConfigurationManager";
import {
  addToCialloConfigCommand,
  openGitRemote,
  removeFileByPath,
  removeFolderByPath,
} from "./utils";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "ciallo-global" is now active!');

  // 初始化配置管理器
  const configManager = new ConfigurationManager();

  // 创建文件浏览器 Provider
  const fileExplorerProvider = new FileExplorerProvider(configManager);

  // 注册 TreeView
  const treeView = vscode.window.createTreeView("cialloFileExplorer", {
    treeDataProvider: fileExplorerProvider,
    showCollapseAll: true,
  });

  treeView.title = "🗂️";

  // 切换显示模式（文件夹/文件）
  const toggleModeCommand = vscode.commands.registerCommand(
    "ciallo-global.toggleMode",
    () => {
      fileExplorerProvider.toggleMode();
      if (fileExplorerProvider.getCurrentMode() === ViewMode.Files) {
        treeView.title = "📄";
      } else {
        treeView.title = "🗂️";
      }
    }
  );

  // 打开文件
  const openFileCommand = vscode.commands.registerCommand(
    "ciallo-global.openFile",
    (filePath: string) => {
      const uri = vscode.Uri.file(filePath);
      vscode.window.showTextDocument(uri);
    }
  );

  // 刷新视图
  const refreshCommand = vscode.commands.registerCommand(
    "ciallo-global.refresh",
    () => {
      fileExplorerProvider.refresh();
    }
  );

  // 打开设置
  const openSettingsCommand = vscode.commands.registerCommand(
    "ciallo-global.openSettings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "cialloGlobal"
      );
    }
  );

  // 在资源管理器中打开
  const revealInExplorerCommand = vscode.commands.registerCommand(
    "ciallo-global.revealInExplorer",
    (item: any) => {
      const filePath = item.resourcePath || item;
      if (filePath) {
        vscode.commands.executeCommand(
          "revealFileInOS",
          vscode.Uri.file(filePath)
        );
      }
    }
  );

  // 在 VS Code 中打开文件夹
  const openFolderCommand = vscode.commands.registerCommand(
    "ciallo-global.openFolder",
    (item: any) => {
      const folderPath = item.resourcePath || item;
      if (folderPath) {
        vscode.commands.executeCommand(
          "vscode.openFolder",
          vscode.Uri.file(folderPath),
          {
            forceNewWindow: true,
          }
        );
      }
    }
  );

  // 移除当前文件配置
  const removeFileCommand = vscode.commands.registerCommand(
    "ciallo-global.removeCurrentFile",
    (item: any) => {
      if (!item || !item.resourcePath) {
        return;
      }
      removeFileByPath(configManager, item.resourcePath);
    }
  );

  // 移除当前文件夹配置
  const removeFolderCommand = vscode.commands.registerCommand(
    "ciallo-global.removeCurrentFolder",
    (item: any) => {
      if (!item || !item.resourcePath) {
        return;
      }
      removeFolderByPath(configManager, item.resourcePath);
    }
  );

  const openGitRemoteCommand = vscode.commands.registerCommand(
    "ciallo-global.openGitRemote",
    async (item: any) => {
      if (!item || !item.resourcePath) {
        return;
      }
      openGitRemote(item.resourcePath);
    }
  );
  context.subscriptions.push(
    treeView,
    toggleModeCommand,
    openFileCommand,
    refreshCommand,
    openSettingsCommand,
    revealInExplorerCommand,
    openFolderCommand,
    removeFileCommand,
    removeFolderCommand,
    addToCialloConfigCommand,
    openGitRemoteCommand
  );
}

export function deactivate() {}
