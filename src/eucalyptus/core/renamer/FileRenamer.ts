import * as vscode from 'vscode';

import { FileContentRenamer } from './FileContentRenamer';
import { fm } from '../FileManager';

export interface CandidateRenamableFile {
    originalName: string;
    directory: vscode.Uri;
    location: vscode.Uri;
}

interface RenamableFile extends CandidateRenamableFile {
    newLocation: vscode.Uri;
}

export interface Replacement {
    from: string;
    to: string;
}

export class FileRenamer {
    pattern: RegExp;
    permissibleNames = [/\bindex\b/i];

    files: Array<RenamableFile>;
    fileContentRenamer: FileContentRenamer;

    constructor(candidateRenamableFiles: Array<CandidateRenamableFile>, private replacement: Replacement) {
        this.pattern = this.createPermissibleNamePattern(replacement.from);
        this.permissibleNames.push(this.pattern);

        this.files = this.analyzeFiles(candidateRenamableFiles);

        this.fileContentRenamer = new FileContentRenamer(
            this.files.map((file) => file.location),
            replacement
        );
    }

    async execute() {
        await this.fileContentRenamer.execute();

        const renamingFileTasks = this.files.map((file) => {
            return fm.rename(file.location, file.newLocation);
        });

        await Promise.all(renamingFileTasks);
    }

    private createPermissibleNamePattern(name: string) {
        return new RegExp(`\\b${name}\\b`, 'i');
    }

    private analyzeFiles(files: Array<CandidateRenamableFile>) {
        const renamableFiles = [];

        for (const file of files) {
            const isMatch = this.permissibleNames.some((name) => name.test(file.originalName));

            if (isMatch) {
                const renamed = file.originalName.replace(this.pattern, this.replacement.to);
                const location = fm.joinPath(file.directory, renamed);

                const renamableFile: RenamableFile = Object.assign(
                    {
                        newLocation: location,
                    },
                    file
                );

                renamableFiles.push(renamableFile);
            }
        }

        return renamableFiles;
    }

    rollback() {
        /*
            TODO: add an implementation
        */
    }
}
