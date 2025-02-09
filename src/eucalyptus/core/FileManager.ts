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

    async isFile(uri: vscode.Uri): Promise<boolean> {
        const stat = await vscode.workspace.fs.stat(uri);
        return stat.type === vscode.FileType.File;
    }

    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        return await vscode.workspace.fs.readDirectory(uri);
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

    /**
     * Reads the contents of a file asynchronously and returns the decoded content as a string.
     *
     * @async
     * @param {vscode.Uri} filePath - The URI of the file to read.
     * @returns {Promise<string>} - The decoded contents of the file.
     * @throws {Error} - If an error occurs while reading the file or decoding the contents.
     */
    async readFile(filePath: vscode.Uri): Promise<string> {
        /*
            Node: fs.readFile(packageJsonPath, 'utf-8')
        */
        const textDecoder = new TextDecoder('utf-8');

        const uint8ArrayData = await vscode.workspace.fs.readFile(filePath);
        const fileContent = textDecoder.decode(uint8ArrayData);

        return fileContent;

        // TODO: throw new Error(`Error reading file: ${filePath}\n${error}`);
    }

    async writeFile(filePath: vscode.Uri, content: string) {
        const encoder = new TextEncoder();
        const uint8ArrayData = encoder.encode(content);

        await vscode.workspace.fs.writeFile(filePath, uint8ArrayData);
    }

    async rename(source: vscode.Uri, target: vscode.Uri) {
        await vscode.workspace.fs.rename(source, target, { overwrite: false });
    }
}

export const fm = new FileManager();
