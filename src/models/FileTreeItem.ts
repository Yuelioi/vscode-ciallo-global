import * as vscode from "vscode";
import * as path from "path";
import { fileIconMap, folderIconMap } from "./iconMap";

export enum FileTreeItemType {
  Folder = "folder",
  File = "file",
}

export class FileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly resourcePath: string,
    public readonly type: FileTreeItemType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly exists: boolean = true,
    public readonly isRoot: boolean = false // 新增参数，标记是否根节点
  ) {
    super(label, collapsibleState);

    this.tooltip = resourcePath;
    this.description = exists ? "" : "(Not Found)";

    // 设置图标
    if (type === FileTreeItemType.Folder) {
      this.iconPath = this.getFolderIcon(resourcePath);
    } else {
      // 根据文件扩展名设置图标
      this.iconPath = this.getFileIcon(resourcePath);
    }

    // 设置上下文值（用于右键菜单等）
    if (type === FileTreeItemType.File) {
      this.contextValue = isRoot ? "rootFile" : "file";
    } else {
      this.contextValue = isRoot ? "rootFolder" : "folder";
    }

    // 文件类型支持双击打开
    if (type === FileTreeItemType.File && exists) {
      this.command = {
        command: "ciallo-global.openFile",
        title: "Open File",
        arguments: [resourcePath],
      };
    }

    // 如果路径不存在，设置为灰色
    if (!exists) {
      this.iconPath = new vscode.ThemeIcon(
        type === FileTreeItemType.Folder ? "folder" : "file",
        new vscode.ThemeColor("disabledForeground")
      );
    }
  }

  /**
   * 根据文件夹名获取图标
   */
  private getFolderIcon(folderPath: string): string {
    // 1. 获取文件夹的名称 (如 '/project/src' -> 'src')
    const folderName = path.basename(folderPath).toLowerCase();

    // 2. 在映射表中查找图标
    // 如果找到，返回对应的 closed 状态图标 (如 'folder-src.svg')
    // 如果未找到，默认使用一个通用的文件夹图标：folder.svg
    const iconFile = folderIconMap[folderName] || "folder.svg";

    // 3. 组合图标的完整路径
    const icon = path.join(__dirname, "../icons", iconFile);

    return icon;
  }

  /**
   * 根据文件扩展名获取图标
   */
  private getFileIcon(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();

    const iconFile = fileIconMap[ext] || "file.svg";

    const icon = path.join(__dirname, "../icons", iconFile);

    return icon;
  }
}
