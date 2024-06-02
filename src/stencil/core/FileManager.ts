import * as vscode from 'vscode';
import * as fs from 'fs';

export interface IFileManager {
    joinPath: (root: vscode.Uri, fileName: string) => vscode.Uri;
    createDirectory: (directoryUri: vscode.Uri) => Promise<void>;
    createFile: (fileUri: vscode.Uri, content: string) => Promise<void>;
}

export class FileManager implements IFileManager {
    exist(uri: vscode.Uri) {
        return fs.existsSync(uri.fsPath);
    }

    joinPath(root: vscode.Uri, fileName: string): vscode.Uri {
        return vscode.Uri.joinPath(root, fileName);
    }

    async isDirectory(uri: vscode.Uri): Promise<boolean> {
        const stat = await vscode.workspace.fs.stat(uri);
        return stat.type === vscode.FileType.Directory;
    }

    async createDirectory(directoryUri: vscode.Uri) {
        return await vscode.workspace.fs.createDirectory(directoryUri);
    }

    async createFile(fileUri: vscode.Uri, content: string) {
        return await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content));
    }
}

export const fm = new FileManager();
