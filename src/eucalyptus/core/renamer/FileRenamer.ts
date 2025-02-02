import * as vscode from 'vscode';

import { fm } from '../FileManager';

interface PreparatoryFile {
    originalName: string;
    path: vscode.Uri;
}

export class FileRenamer {
    permissibleNames = [/\bindex\b/i];

    files: Array<PreparatoryFile> = [];

    addPermissibleName(name: string) {
        const regexp = new RegExp(`\\b${name}\\b`, 'i');
        this.permissibleNames.push(regexp);
    }

    async analyzeDirectoryFiles(directory: vscode.Uri, dirname: string) {
        this.addPermissibleName(dirname);
        const files = await fm.readDirectory(directory);

        for (const [fileName, fileType] of files) {
            if (fileType !== vscode.FileType.File) {
                continue;
            }

            const hasMatch = this.permissibleNames.some((p) => p.test(fileName));

            if (hasMatch) {
                this.files.push({
                    originalName: fileName,
                    path: fm.joinPath(directory, fileName),
                });
            }
        }
    }

    renameDirectoryFiles() {}

    rollback() {}
}
