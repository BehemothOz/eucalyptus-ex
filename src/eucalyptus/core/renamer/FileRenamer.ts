import * as vscode from 'vscode';

import { FileContentRenamer } from './FileContentRenamer';
import { fm } from '../FileManager';

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
}

/**
 * Represents a replacement operation, specifying what to replace and what to replace it with.
 */
export interface Replacement {
    from: string;
    to: string;
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
     * An array of files that are ready to be renamed.
     */
    files: Array<RenamableFile>;
    /**
     * An instance of FileContentRenamer used to update the content of files before renaming.
     */
    fileContentRenamer: FileContentRenamer;

    /**
     * Constructor for the FileRenamer class.
     * @param candidateRenamableFiles - An array of files that are candidates for renaming.
     * @param replacement - The replacement operation specifying what to replace and what to replace it with.
     */
    constructor(candidateRenamableFiles: Array<CandidateRenamableFile>, private replacement: Replacement) {
        this.pattern = this.createPermissibleNamePattern(replacement.from);
        this.permissibleNames.push(this.pattern);

        this.files = this.analyzeFiles(candidateRenamableFiles);

        this.fileContentRenamer = new FileContentRenamer(
            this.files.map((file) => file.location),
            replacement
        );
    }

    /**
     * Executes the renaming process.
     * First, updates the content of the files, then renames the files themselves.
     */
    async execute() {
        try {
            await this.fileContentRenamer.execute();

            const renamingFileTasks = this.files.map((file) => {
                return fm.rename(file.location, file.newLocation);
            });

            await Promise.all(renamingFileTasks);
        } catch {
            await this.fileContentRenamer.rollback();
        }
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
     * Rolls back the renaming process.
     * TODO: Add an implementation for rollback functionality.
     */
    rollback() {
        /*
            TODO: add an implementation
        */
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
