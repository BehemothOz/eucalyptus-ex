import * as vscode from 'vscode';
import * as path from 'node:path';

import { showInputField } from './core/ui';
import { FileRenamer, Replacement, type CandidateRenamableFile } from './core/renamer/FileRenamer';
import { fm } from './core/FileManager';
import { hasSpaces } from './Eucalyptus';
import { createReplacement } from './core/utils/replacement';

/**
 * A class responsible for renaming a directory and its associated files.
 */
export class EucalyptusRenamer {
    /**
     * The parent directory of the current directory being renamed.
     */
    root: vscode.Uri;
    /**
     * The name of the directory to be renamed.
     */
    directoryName: string;

    replacement!: Replacement;
    candidateRenamableFiles!: CandidateRenamableFile[];

    isInitialized: boolean = false;

    constructor(private directory: vscode.Uri) {
        this.directoryName = path.basename(this.directory.fsPath);
        this.root = vscode.Uri.file(path.dirname(this.directory.fsPath));
    }

    async initialize() {
        const newDirectoryName = await this.showInput();

        if (newDirectoryName === null) {
            return undefined;
        }

        this.candidateRenamableFiles = await this.getDirectoryFiles();
        this.replacement = createReplacement(this.directoryName, newDirectoryName);

        this.isInitialized = true;
    }

    async execute() {
        if (!this.isInitialized) {
            throw new Error('');
        }

        try {
            const fileRenamer = new FileRenamer(this.candidateRenamableFiles, this.replacement);

            await fileRenamer.execute();
            await this.renameDirectory();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Shows an input box to the user.
     * @returns {Promise<string | null>} The user input or undefined if the input was cancelled.
     * @private
     */
    private async showInput(): Promise<string | null> {
        const join = (value: string) => {
            const target = vscode.Uri.file(path.dirname(this.directory.fsPath));
            return fm.joinPath(target, value);
        };

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

    private async renameDirectory() {
        await fm.rename(this.directory, fm.joinPath(this.root, this.replacement.to));
    }
}
