import vscode from 'vscode';

import { FileStorage } from './FileStorage';
import { fm } from '../FileManager';

/**
 * A class to manage the process of reading, replacing, and writing file contents.
 * Extends the `FileStorage` class to leverage its storage capabilities.
 */
export class FileContentRenamer extends FileStorage {
    /**
     * Creates an instance of FileContentRenamer.
     *
     * @param filePaths - An array of file paths (as `vscode.Uri`) to process.
     * @param replacer - An object containing the string to replace (`from`) and the replacement string (`to`).
     */
    constructor(private filePaths: Array<vscode.Uri>, private replacer: { from: string; to: string }) {
        super(filePaths);
    }

    /**
     * Reads the content of all files specified in `filePaths` and stores it in the storage.
     * If any file fails to read, an error is thrown.
     */
    private async read() {
        const readingTasks = this.filePaths.map(async (filePath) => {
            try {
                const fileContent = await fm.readFile(filePath);
                this.setOriginal(filePath, fileContent);
            } catch (error) {
                throw new Error('File reading error');
            }
        });

        await Promise.all(readingTasks);
    }

    /**
     * Writes the modified content of all files back to their respective paths.
     * If any file fails to write, an error is thrown.
     */
    private async write() {
        const writingTasks = this.filePaths.map(async (filePath) => {
            const editorialContent = this.getEditorial(filePath);

            if (editorialContent === null) {
                return null;
            }

            try {
                await fm.writeFile(filePath, editorialContent);
                this.setModifiedStatus(filePath);
            } catch (error) {
                throw new Error('File writing error');
            }
        });

        await Promise.all(writingTasks);
    }

    /**
     * Replaces occurrences of the `from` string with the `to` string in the original content of each file.
     * The modified content is stored in the `editorial` field of the storage.
     */
    private async replace() {
        const regExp = new RegExp(this.replacer.from, 'g');

        this.filePaths.forEach((filePath) => {
            const originalContent = this.getOriginal(filePath);

            if (originalContent) {
                const editorialContent = originalContent.replace(regExp, this.replacer.to);
                this.setEditorial(filePath, editorialContent);
            }
        });
    }

    /**
     * Executes the entire pipeline: reads file contents, replaces strings, and writes the modified content back to the files.
     * If any step fails, the process is rolled back to restore the original state.
     *
     * @throws Will throw an error if any step in the pipeline fails.
     */
    public async execute(): Promise<void> {
        const steps = [this.read, this.replace, this.write];

        try {
            for (const step of steps) {
                await step.call(this);
            }
        } catch (error) {
            await this.rollback();
            // throw new Error(`Execution failed: ${error.message}`);
        }
    }

    /**
     * Rolls back changes by restoring the original content of files.
     * This method is called if an error occurs during the execution of the pipeline.
     */
    async rollback() {
        for (const filePath of this.filePaths) {
            try {
                console.log('this.storage', this.storage);
                // await fs.writeFile(filePath, cache[filePath], 'utf8');
            } catch (rollbackErr) {
                console.error(`Ошибка при восстановлении файла ${filePath}:`, rollbackErr);
            }
        }
    }

    /**
     * Clears the storage.
     * Currently, this method is not implemented.
     */
    clear() {}
}

class FileContentError extends Error {
    public operation: 'read' | 'write' | 'restore';
    public fileName: string;

    constructor(operation: 'read' | 'write', fileName: string, message: string) {
        super(`File Content Error (${operation.toUpperCase()}): ${message}`);
        this.name = 'FileContentError';
        this.operation = operation;
        this.fileName = fileName;
    }
}
