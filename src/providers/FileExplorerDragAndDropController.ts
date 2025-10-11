import * as vscode from "vscode";
import { ConfigurationManager } from "../config/ConfigurationManager";

import { FileTreeItem } from "../models/FileTreeItem";
import * as fs from "fs";

import * as nls from "vscode-nls";

const localize = nls.loadMessageBundle();

export class FileExplorerDragAndDropController
  implements vscode.TreeDragAndDropController<FileTreeItem>
{
  // 声明支持从文件系统拖入
  readonly dropMimeTypes = ["text/uri-list"];
  readonly dragMimeTypes: string[] = [];

  constructor(private configManager: ConfigurationManager) {}

  async handleDrop(
    target: FileTreeItem | undefined,
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken
  ): Promise<void> {
    const uriList = dataTransfer.get("text/uri-list");
    if (!uriList) {
      return;
    }

    const uris = uriList.value
      .split("\r\n")
      .filter((s: any) => !!s)
      .map((s: any) => vscode.Uri.parse(s));

    const foldersToAdd: string[] = [];
    const filesToAdd: string[] = [];

    for (const uri of uris) {
      const fsPath = uri.fsPath;
      if (!fs.existsSync(fsPath)) {
        continue;
      }

      const stat = fs.statSync(fsPath);
      if (stat.isDirectory()) {
        foldersToAdd.push(fsPath);
      } else {
        filesToAdd.push(fsPath);
      }
    }

    // 更新配置
    if (foldersToAdd.length > 0) {
      const existing = this.configManager.getFolders();
      const merged = Array.from(new Set([...existing, ...foldersToAdd]));
      await this.configManager.updateFolders(merged);
    }

    if (filesToAdd.length > 0) {
      const existing = this.configManager.getFiles();
      const merged = Array.from(new Set([...existing, ...filesToAdd]));
      await this.configManager.updateFiles(merged);
    }

    vscode.window.showInformationMessage(
      localize(
        "fileExplorer.addedMessage",
        "Added {0} folder(s) and {1} file(s).",
        foldersToAdd.length,
        filesToAdd.length
      )
    );
  }

  handleDrag?(): void {
    // 暂不支持 TreeView 内部拖动
  }
}
