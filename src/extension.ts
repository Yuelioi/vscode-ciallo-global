import * as vscode from "vscode";
import {
  FileExplorerProvider,
  ViewMode,
} from "./providers/FileExplorerProvider";

import { FileExplorerDragAndDropController } from "./providers/FileExplorerDragAndDropController";

import { ConfigurationManager } from "./config/ConfigurationManager";
import {
  addToConfigCommand,
  openGitRemote,
  removeFileByPath,
  removeFolderByPath,
} from "./utils";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "omni-tree" is now active!');

  // 初始化配置管理器
  const configManager = new ConfigurationManager();

  // 创建文件浏览器 Provider
  const fileExplorerProvider = new FileExplorerProvider(configManager);

  // 拖拽管理器
  const dragAndDropController = new FileExplorerDragAndDropController(
    configManager
  );

  // 注册 TreeView
  const treeView = vscode.window.createTreeView("omniFileExplorer", {
    treeDataProvider: fileExplorerProvider,
    showCollapseAll: true,
    dragAndDropController,
  });

  treeView.title = "Omit Tree:🗂️";

  // 切换显示模式（文件夹/文件）
  const toggleModeCommand = vscode.commands.registerCommand(
    "omni-tree.toggleMode",
    () => {
      fileExplorerProvider.toggleMode();
      if (fileExplorerProvider.getCurrentMode() === ViewMode.Files) {
        treeView.title = "Omit Tree:📄";
      } else {
        treeView.title = "Omit Tree:🗂️";
      }
    }
  );

  // 打开文件
  const openFileCommand = vscode.commands.registerCommand(
    "omni-tree.openFile",
    (filePath: string) => {
      const uri = vscode.Uri.file(filePath);
      vscode.window.showTextDocument(uri);
    }
  );

  // 刷新视图
  const refreshCommand = vscode.commands.registerCommand(
    "omni-tree.refresh",
    () => {
      fileExplorerProvider.refresh();
    }
  );

  // 打开设置
  const openSettingsCommand = vscode.commands.registerCommand(
    "omni-tree.openSettings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "omniTree"
      );
    }
  );

  // 在资源管理器中打开
  const revealInExplorerCommand = vscode.commands.registerCommand(
    "omni-tree.revealInExplorer",
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
    "omni-tree.openFolder",
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
    "omni-tree.removeCurrentFile",
    (item: any) => {
      if (!item || !item.resourcePath) {
        return;
      }
      removeFileByPath(configManager, item.resourcePath);
    }
  );

  // 移除当前文件夹配置
  const removeFolderCommand = vscode.commands.registerCommand(
    "omni-tree.removeCurrentFolder",
    (item: any) => {
      if (!item || !item.resourcePath) {
        return;
      }
      removeFolderByPath(configManager, item.resourcePath);
    }
  );

  const openGitRemoteCommand = vscode.commands.registerCommand(
    "omni-tree.openGitRemote",
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
    addToConfigCommand,
    openGitRemoteCommand
  );
}

export function deactivate() {}
