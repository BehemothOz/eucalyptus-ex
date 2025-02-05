import * as vscode from 'vscode';
import * as path from 'node:path';

import { showInputField } from './core/ui';
import { FileRenamer, type CandidateRenamableFile } from './core/renamer/FileRenamer';
import { fm } from './core/FileManager';
import { hasSpaces } from './Eucalyptus';

export class EucalyptusRenamer {
    directoryName: string;
    isInitialized: boolean = false;

    constructor(private directory: vscode.Uri) {
        this.directoryName = path.basename(this.directory.fsPath);
    }

    async initialize() {
        const candidateRenamableFiles = await this.getDirectoryFiles();
        const fileRenamer = new FileRenamer(candidateRenamableFiles, {
            from: this.directoryName,
            to: 'Banana',
        });

        this.isInitialized = true;
    }

    async execute() {
        if (!this.isInitialized) {
            throw new Error('');
        }

        // try {
        //     await fileRenamer.renameDirectoryFiles();
        // } catch (error) {
        //     already exists at destination.
        //     console.log(error);
        // }
    }

    /**
     * Shows an input box to the user.
     * @returns {Promise<string | null>} The user input or undefined if the input was cancelled.
     * @private
     */
    private async showInput(): Promise<string | null> {
        const join = (value: string) => fm.joinPath(this.file, value);

        return await showInputField({
            placeholder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
            validateAccept(value) {
                if (hasSpaces(value)) {
                    return 'The name cannot contain spaces';
                }

                if (fm.exist(join(value))) {
                    return `A folder ${value} already exists at this location`;
                }

                return null;
            },
        });
    }

    async renameDirectory() {
        const target = vscode.Uri.file(path.dirname(this.directory.fsPath));
        const a = fm.joinPath(target, 'Banana');
        await fm.rename(this.directory, a);
    }

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
