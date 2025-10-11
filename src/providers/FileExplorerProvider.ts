import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ConfigurationManager } from "../config/ConfigurationManager";
import { FileTreeItem, FileTreeItemType } from "../models/FileTreeItem";

export enum ViewMode {
  Folders = "folders",
  Files = "files",
}

export class FileExplorerProvider
  implements vscode.TreeDataProvider<FileTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    FileTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private currentMode: ViewMode = ViewMode.Folders;

  constructor(private configManager: ConfigurationManager) {
    // 监听配置变化，自动刷新
    configManager.onConfigChange(() => {
      this.refresh();
    });
  }

  /**
   * 刷新视图
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * 切换显示模式
   */
  toggleMode(): void {
    this.currentMode =
      this.currentMode === ViewMode.Folders ? ViewMode.Files : ViewMode.Folders;
    console.log(
      `切换到${this.currentMode === ViewMode.Folders ? "文件夹" : "文件"}模式`
    );
    this.refresh();
  }

  /**
   * 获取当前模式
   */
  getCurrentMode(): ViewMode {
    return this.currentMode;
  }

  getTreeItem(element: FileTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FileTreeItem): Promise<FileTreeItem[]> {
    if (!element) {
      // 根节点
      return this.getRootItems();
    } else {
      // 子节点（文件夹展开）
      return this.getFolderChildren(element);
    }
  }

  /**
   * 获取根节点列表
   */
  private getRootItems(): FileTreeItem[] {
    if (this.currentMode === "folders") {
      const folders = this.configManager.getFolders();
      return folders.map((folderPath) => {
        const exists = fs.existsSync(folderPath);
        return new FileTreeItem(
          path.basename(folderPath),
          folderPath,
          FileTreeItemType.Folder,
          vscode.TreeItemCollapsibleState.Collapsed,
          exists,
          true
        );
      });
    } else {
      const files = this.configManager.getFiles();
      return files.map((filePath) => {
        const exists = fs.existsSync(filePath);
        return new FileTreeItem(
          path.basename(filePath),
          filePath,
          FileTreeItemType.File,
          vscode.TreeItemCollapsibleState.None,
          exists,
          true
        );
      });
    }
  }

  /**
   * 获取文件夹的子项
   */
  private getFolderChildren(folder: FileTreeItem): FileTreeItem[] {
    if (folder.type !== FileTreeItemType.Folder) {
      return [];
    }

    try {
      const items = fs.readdirSync(folder.resourcePath);
      const folders: FileTreeItem[] = [];
      const files: FileTreeItem[] = [];

      for (const item of items) {
        const itemPath = path.join(folder.resourcePath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          folders.push(
            new FileTreeItem(
              item,
              itemPath,
              FileTreeItemType.Folder,
              vscode.TreeItemCollapsibleState.Collapsed,
              true
            )
          );
        } else {
          files.push(
            new FileTreeItem(
              item,
              itemPath,
              FileTreeItemType.File,
              vscode.TreeItemCollapsibleState.None,
              true,
              false
            )
          );
        }
      }

      // ✅ 先文件夹，后文件
      return [...folders, ...files];
    } catch (error) {
      console.error(`Read folder error: ${folder.resourcePath}`, error);
      return [];
    }
  }
}
