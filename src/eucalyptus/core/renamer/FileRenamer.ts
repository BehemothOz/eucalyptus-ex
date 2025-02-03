import * as vscode from 'vscode';

import { FileContentRenamer } from './FileContentRenamer';
import { fm } from '../FileManager';

export interface CandidateRenamableFile {
    directory: vscode.Uri;
    originalName: string;
    location: vscode.Uri;
}

interface RenamableFile extends CandidateRenamableFile {
    newLocation: vscode.Uri;
}

export interface Replacer {
    from: string;
    to: string;
}

export class FileRenamer {
    pattern: RegExp;
    permissibleNames = [/\bindex\b/i];

    files: Array<RenamableFile>;
    fileContentRenamer: FileContentRenamer;

    constructor(candidateRenamableFiles: Array<CandidateRenamableFile>, private replacer: Replacer) {
        this.pattern = this.createPermissibleNamePattern(replacer.from);
        this.permissibleNames.push(this.pattern);

        this.files = this.analyzeFiles(candidateRenamableFiles);
        console.log('RenamableFiles', this.files);

        this.fileContentRenamer = new FileContentRenamer(this.files.map((file) => file.location), replacer);
    }

    createPermissibleNamePattern(name: string) {
        return new RegExp(`\\b${name}\\b`, 'i');
    }

    analyzeFiles(files: Array<CandidateRenamableFile>) {
        const renamableFiles = [];

        for (const file of files) {
            const isMatch = this.permissibleNames.some((name) => name.test(file.originalName));

            if (isMatch) {
                const renamed = this.renameFile(file.originalName);
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

    renameFile(originalName: string) {
        return originalName.replace(this.pattern, this.replacer.to);
    }

    renameDirectoryFiles() {
        this.fileContentRenamer.init();
        // const d_path = vscode.Uri.joinPath(vscode.Uri.file(dirname), 'Banana');
    }

    rollback() {}
}
