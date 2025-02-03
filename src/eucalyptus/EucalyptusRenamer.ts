import * as vscode from 'vscode';
import * as path from 'node:path';

import { FileRenamer, type CandidateRenamableFile } from './core/renamer/FileRenamer';
import { fm } from './core/FileManager';

export class EucalyptusRenamer {
    directoryName: string;

    constructor(private directory: vscode.Uri) {
        this.directoryName = path.basename(this.directory.fsPath);
    }

    async initialize() {
        const candidateRenamableFiles = await this.getDirectoryFiles();
        const fileRenamer = new FileRenamer(candidateRenamableFiles, {
            from: this.directoryName,
            to: 'Banana',
        });

        fileRenamer.renameDirectoryFiles();
    }

    async rename() {}

    private async getDirectoryFiles() {
        const files = await fm.readDirectory(this.directory);
        const candidates: Array<CandidateRenamableFile> = [];

        for (const [fileName, fileType] of files) {
            if (fileType !== vscode.FileType.File) {
                continue;
            }

            candidates.push({
                directory: this.directory,
                originalName: fileName,
                location: fm.joinPath(this.directory, fileName),
            });
        }

        return candidates;
    }
}
