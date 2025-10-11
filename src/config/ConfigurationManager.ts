import * as vscode from "vscode";

export interface Config {
  folders: string[];
  files: string[];
}

export class ConfigurationManager {
  private static readonly CONFIG_KEY = "omniTree";

  /**
   * 获取配置
   */
  getConfig(): Config {
    const config = vscode.workspace.getConfiguration(
      ConfigurationManager.CONFIG_KEY
    );

    return {
      folders: config.get<string[]>("folders") || [],
      files: config.get<string[]>("files") || [],
    };
  }

  /**
   * 获取文件夹列表
   */
  getFolders(): string[] {
    return this.getConfig().folders;
  }

  /**
   * 获取文件列表
   */
  getFiles(): string[] {
    return this.getConfig().files;
  }

  /**
   * 监听配置变化
   */
  onConfigChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(ConfigurationManager.CONFIG_KEY)) {
        callback();
      }
    });
  }

  /**
   * 更新文件夹列表
   */
  async updateFolders(folders: string[]): Promise<void> {
    const config = vscode.workspace.getConfiguration(
      ConfigurationManager.CONFIG_KEY
    );
    await config.update("folders", folders, vscode.ConfigurationTarget.Global);
  }

  /**
   * 更新文件列表
   */
  async updateFiles(files: string[]): Promise<void> {
    const config = vscode.workspace.getConfiguration(
      ConfigurationManager.CONFIG_KEY
    );
    await config.update("files", files, vscode.ConfigurationTarget.Global);
  }
}
