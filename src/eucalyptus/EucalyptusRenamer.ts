import * as vscode from 'vscode';
import * as path from 'node:path';

import { showInputField } from './core/ui';
import { FileRenamer, type CandidateRenamableFile } from './core/renamer/FileRenamer';
import { fm } from './core/FileManager';
import { hasSpaces } from './Eucalyptus';
import { createReplacement, type Replacement } from './core/utils/replacement';

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
    /**
     * The replacement object that defines how names should be transformed.
     */
    replacement!: Replacement;
    /**
     * A list of candidate files within the directory that can be renamed.
     */
    candidateRenamableFiles!: CandidateRenamableFile[];
    /**
     * A flag indicating whether the renamer has been initialized.
     */
    isInitialized: boolean = false;

    /**
     * Creates an instance of EucalyptusRenamer.
     * @param directory - The URI of the directory to be renamed.
     */
    constructor(private directory: vscode.Uri) {
        this.directoryName = path.basename(this.directory.fsPath);
        this.root = vscode.Uri.file(path.dirname(this.directory.fsPath));
    }

    /**
     * Initializes the renamer by prompting the user for a new directory name,
     * validating the input, and preparing the replacement logic.
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     */
    async initialize(): Promise<void> {
        const newDirectoryName = await this.showInput();

        if (newDirectoryName === null) {
            return undefined;
        }

        this.candidateRenamableFiles = await this.getDirectoryFiles();
        this.replacement = createReplacement(this.directoryName, newDirectoryName);

        this.isInitialized = true;
    }

    /**
     * Executes the renaming process for both the directory and its files.
     * @returns {Promise<void>} A promise that resolves when the renaming is complete.
     */
    async execute(): Promise<void> {
        if (!this.isInitialized) {
            throw new Error('');
        }

        try {
            const fileRenamer = new FileRenamer(this.candidateRenamableFiles, this.replacement);

            await fileRenamer.execute();
            await this.renameDirectory();
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage('unexpected error');
        }
    }

    /**
     * Shows an input box to the user.
     * @returns {Promise<string | null>} The user input or undefined if the input was cancelled.
     * @private
     */
    private async showInput(): Promise<string | null> {
        const join = (value: string) => {
            return fm.joinPath(this.root, value);
        };

        return await showInputField({
            placeholder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
            validateAccept(value) {
                const enteredValue = value.trim();

                if (hasSpaces(enteredValue)) {
                    return 'The name cannot contain spaces';
                }

                if (fm.exist(join(enteredValue))) {
                    return `A folder ${enteredValue} already exists at this location`;
                }

                return null;
            },
        });
    }

    /**
     * Retrieves all files within the directory and prepares them for renaming.
     * @returns {Promise<CandidateRenamableFile[]>} A promise that resolves with the list of candidate files.
     * @private
     */
    private async getDirectoryFiles(): Promise<CandidateRenamableFile[]> {
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

    /**
     * Renames the directory itself using the provided replacement logic.
     * @returns {Promise<void>} A promise that resolves when the directory is renamed.
     * @private
     */
    private async renameDirectory(): Promise<void> {
        await fm.rename(this.directory, fm.joinPath(this.root, this.replacement.to));
    }
}
