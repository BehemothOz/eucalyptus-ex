import * as vscode from 'vscode';

export class FileManager {
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
