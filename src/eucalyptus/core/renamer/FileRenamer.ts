import * as vscode from 'vscode';

import { fm } from '../FileManager';
import { FileContentRenamer } from './FileContentRenamer';
import { CommandRenamerError, isCommandRenamerError } from './error';
import { type Replacement } from '../utils/replacement';

/**
 * Represents a file that is a candidate for renaming.
 * Contains the original name, directory, and location of the file.
 */
export interface CandidateRenamableFile {
    /**
     * Original name of the file
     */
    originalName: string;
    /**
     * Directory where the file resides
     */
    directory: vscode.Uri;
    /**
     * File location
     */
    location: vscode.Uri;
}

/**
 * Represents a file that is ready to be renamed.
 * Extends CandidateRenamableFile with the new location after renaming.
 */
interface RenamableFile extends CandidateRenamableFile {
    /**
     * New file location after renaming
     */
    newLocation: vscode.Uri;
    isModified: boolean;
}

/**
 * A class responsible for renaming files based on a replacement pattern.
 */
export class FileRenamer {
    /**
     * A regular expression pattern used to match permissible names for renaming.
     */
    pattern: RegExp;
    /**
     * An array of regular expressions representing permissible names that can be renamed.
     */
    permissibleNames = [/\bindex\b/i];

    /**
     * ! An array of files that are ready to be renamed.
     */
    files: Array<RenamableFile>;
    /**
     * An instance of FileContentRenamer used to update the content of files before renaming.
     */
    fileContentRenamer: FileContentRenamer;

    filePathsForRenameContent: Array<vscode.Uri>;

    /**
     * Constructor for the FileRenamer class.
     * @param candidateRenamableFiles - An array of files that are candidates for renaming.
     * @param replacement - The replacement operation specifying what to replace and what to replace it with.
     */
    constructor(candidateRenamableFiles: Array<CandidateRenamableFile>, private replacement: Replacement) {
        this.pattern = this.createPermissibleNamePattern(replacement.from);
        this.permissibleNames.push(this.pattern);

        const analyzedFiles = this.analyzeFiles(candidateRenamableFiles);

        this.files = this.excludeFiles(analyzedFiles);
        this.filePathsForRenameContent = analyzedFiles.map((file) => file.location);

        this.fileContentRenamer = new FileContentRenamer(this.filePathsForRenameContent, replacement);
    }

    /**
     * Executes the renaming process.
     * First, updates the content of the files, then renames the files themselves.
     */
    async execute() {
        if (this.checkExistenceLocation()) {
            throw new CommandRenamerError('A file already exists');
        }

        try {
            await this.fileContentRenamer.execute();

            const renamingFileTasks = this.files.map(async (file) => {
                await fm.rename(file.location, file.newLocation);
                file.isModified = true;
            });

            await Promise.all(renamingFileTasks);
        } catch (error) {
            await this.rollback();

            if (isCommandRenamerError(error)) {
                throw error;
            }

            throw new CommandRenamerError(`Error when changing the file name`);
        }
    }

    /**
     * Check correctness of new location before renaming
     * @returns Returns true if at least one new path (location) already exists.
     */
    checkExistenceLocation(): boolean {
        return this.files.some((file) => fm.exist(file.newLocation));
    }

    /**
     * Creates a regular expression pattern for matching permissible names.
     * @param name - The name to create a pattern for.
     * @returns A RegExp object that matches the given name as a whole word.
     */
    private createPermissibleNamePattern(name: string) {
        return new RegExp(`\\b${name}\\b`, 'i');
    }

    /**
     * Creates a RenamableFile object from a CandidateRenamableFile.
     * @param file - The candidate file to be renamed.
     * @returns A RenamableFile object with the new location set.
     */
    private createRenamableFile(file: CandidateRenamableFile) {
        const renamed = file.originalName.replace(this.pattern, this.replacement.to);
        const location = fm.joinPath(file.directory, renamed);

        const renamableFile: RenamableFile = Object.assign(
            {
                newLocation: location,
                isModified: false,
            },
            file
        );

        return renamableFile;
    }

    /**
     * Analyzes the list of candidate files and determines which ones can be renamed.
     * @param files - An array of candidate files to analyze.
     * @returns An array of RenamableFile objects that are ready to be renamed.
     */
    private analyzeFiles(files: Array<CandidateRenamableFile>) {
        const renamableFiles = [];

        for (const file of files) {
            const isMatch = this.permissibleNames.some((name) => name.test(file.originalName));

            if (isMatch) {
                const renamableFile = this.createRenamableFile(file);
                renamableFiles.push(renamableFile);
            }
        }

        return renamableFiles;
    }

    /**
     * Excludes files named "index" from the file list.
     * @param {RenamableFile[]} files - An array of file objects to filter.
     * @returns {RenamableFile[]} - The filtered file array, where the files named "index" are (for example, index.js , index.ts) deleted.
     * @private
     */
    private excludeFiles(files: RenamableFile[]): RenamableFile[] {
        const excludeIndexFile = new RegExp(/^index\.\w+$/);

        return files.filter((file) => !excludeIndexFile.test(file.originalName));
    }

    /**
     * Rolls back the renaming process.
     */
    async rollback() {
        const modifiedFiles = this.files.filter((file) => file.isModified);
        const renamingRollbackTasks = modifiedFiles.map((file) => {
            return fm.rename(file.newLocation, file.location);
        });

        try {
            await Promise.all(renamingRollbackTasks);
        } catch {
            throw new Error('Recovery error');
        }
    }
}

// class RenameError extends Error {
//     public type: 'file' | 'directory';
//     public operation: 'rename';
//     public oldName: string;
//     public newName: string;

//     constructor(oldName: string, newName: string, message: string) {
//         super(`File Name Error (RENAME): ${message}`);
//         this.name = 'FileNameError';
//         this.operation = 'rename';
//         this.oldName = oldName;
//         this.newName = newName;
//     }
// }
