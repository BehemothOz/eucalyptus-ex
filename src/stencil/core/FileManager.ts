import * as vscode from 'vscode';
import * as fs from 'fs';

/**
 * Interface representing a file manager.
 * @interface
 */
export interface IFileManager {
    /**
     * Checks if a file or directory exists at the given URI.
     */
    exist: (uri: vscode.Uri) => boolean;
    /**
     * Joins a root URI and a file name into a single URI.
     */
    joinPath: (root: vscode.Uri, fileName: string) => vscode.Uri;
    /**
     * Creates a directory at the specified URI.
     */
    createDirectory: (directoryUri: vscode.Uri) => Promise<void>;
    /**
     * Creates a file at the specified URI with the given content.
     */
    createFile: (fileUri: vscode.Uri, content: string) => Promise<void>;
}

export class FileManager implements IFileManager {
    /**
     * @returns {boolean} True if the file or directory exists, false otherwise.
     */
    exist(uri: vscode.Uri): boolean {
        return fs.existsSync(uri.fsPath);
    }

    /**
     * @returns {vscode.Uri} The joined URI.
     */
    joinPath(root: vscode.Uri, fileName: string): vscode.Uri {
        return vscode.Uri.joinPath(root, fileName);
    }

    /**
     * @returns {Promise<boolean>} A promise that resolves to true if the URI points to a directory, false otherwise.
     */
    async isDirectory(uri: vscode.Uri): Promise<boolean> {
        const stat = await vscode.workspace.fs.stat(uri);
        return stat.type === vscode.FileType.Directory;
    }

    /**
     * @returns {Promise<void>} A promise that resolves when the directory is created.
     */
    async createDirectory(directoryUri: vscode.Uri): Promise<void> {
        return await vscode.workspace.fs.createDirectory(directoryUri);
    }

    /**
     * @returns {Promise<void>} A promise that resolves when the file is created.
     */
    async createFile(fileUri: vscode.Uri, content: string): Promise<void> {
        return await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content));
    }
}

export const fm = new FileManager();
