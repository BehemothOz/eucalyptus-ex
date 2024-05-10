import * as vscode from 'vscode';

export interface IFileManager {
    joinPath: (root: vscode.Uri, fileName: string) => vscode.Uri;
    createDirectory: (directoryUri: vscode.Uri) => Promise<void>;
    createFile: (fileUri: vscode.Uri, content: string) => Promise<void>;
}

export class FileManager implements IFileManager {
    joinPath(root: vscode.Uri, fileName: string): vscode.Uri {
        return vscode.Uri.joinPath(root, fileName);
    }

    async createDirectory(directoryUri: vscode.Uri) {
        return await vscode.workspace.fs.createDirectory(directoryUri);
    }

    async createFile(fileUri: vscode.Uri, content: string) {
        return await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content));
    }
}
