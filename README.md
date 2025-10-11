# 🗂️ Ciallo Global

> 🌍 Share Files and Folders Across Multiple VS Code Projects

---

## Language

[English](./README.md) | [中文](./README.zh-cn.md)

## The Motivation

I recently started using the Rime input method and found myself constantly needing to access my custom dictionary files. It was frustrating and inefficient to repeatedly navigate to them.

**Ciallo Global** solves this by letting you access important files and folders from a single, unified view, no matter which project you currently have open.

## ✨ Features

**Ciallo Global** allows you to  **share files and folders across multiple workspaces** . You can quickly access, open, and manage them from a centralized view, regardless of your current project's location.

### 🧩 Core Features

* 📁  **Global Shared Folders** : Access frequently used folder directories in any project.
* 📄  **Global Shared Files** : Quickly open common individual files.
* 🔄  **Dual View Mode** : Instantly switch between **Folder Mode** and **File Mode** views.
* 🧹  **Quick Management** : Right-click to easily remove, open, or refresh items.
* ⚙️  **Persistent Configuration** : Settings are automatically saved to your VS Code global settings.
* 🌐  Git projects support open in remote url

## 📦 Installation

### Install from VS Code Marketplace (Recommended)

Search for `Ciallo Global` in the VS Code Extensions view, or run the following command:

```
ext install ciallo-global
```

---

## 🚀 How to Use

### 1️⃣ Open the View

A new icon will appear in your Activity Bar:

> 📦 **Ciallo Manager**

Click it to open the global files/folders view.

---

### 2️⃣ Add Global Shares

1. **Manual Addition (Via UI)**
   Access the extension settings and use the provided input fields to add paths.

2. Drag files or folders into the view (Recommended)

3. **Adding via `settings.json` (Advanced)**
   You can manually add paths to your global VS Code settings file:

```json
{
    "cialloGlobal.folders": [
        "/Users/you/Documents/shared-config"
    ],
    "cialloGlobal.files": [
        "/Users/you/Documents/notes/todo.md"
    ]
}
```

---

### 3️⃣ Management Operations

| Operation                                         | Description                                                                        |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 🗂️ Right-click Folder → “Open in New Window” | Opens the shared folder directly in a new VS Code window.                          |
| 🧹 Right-click File/Folder → “Remove”          | Removes the item from the global list (does**not**delete the physical file). |
| 🔄 Top Toolbar → “Refresh”                     | Reloads the configuration and refreshes the view.                                  |
| ↔️ Top Toolbar → “Toggle Folder/File Mode”   | Switches the view between showing folders or showing files.                        |

---

## ⚙️ Configuration Options

| Name                     | Type         | Default Value | Description                                  |
| ------------------------ | ------------ | ------------- | -------------------------------------------- |
| `cialloGlobal.folders` | `string[]` | `[]`        | A list of paths for globally shared folders. |
| `cialloGlobal.files`   | `string[]` | `[]`        | A list of paths for globally shared files.   |

> 📝 All configurations are saved in the VS Code global settings, making them available across any project.

---

## 📄 License

MIT License © 2025 YUE LI

## Credits

This extension uses icons from: [vscode-material-icon-theme](https://github.com/material-extensions/vscode-material-icon-theme)
