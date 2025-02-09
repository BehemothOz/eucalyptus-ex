import vscode from 'vscode';

/**
 * Represents a file path using VSCode's Uri type.
 */
type FilePath = vscode.Uri;

/**
 * Represents the storage item for a file.
 */
interface FileStorageItem {
    /**
     * Original content of the file.
     */
    original: string | null;
    /**
     * Edited content of the file.
     */
    editorial: string | null;
    /**
     * Indicates whether the file has been modified.
     */
    isModified: boolean;
}

/**
 * A class to manage the storage of file contents.
 */
export class FileStorage {
    /**
     * Internal storage for file data, where the key is the file path and the value is the file's storage item.
     */
    storage: Map<FilePath, FileStorageItem> = new Map();

    constructor(filePaths: Array<FilePath>) {
        filePaths.forEach((filePath) => {
            this.storage.set(filePath, this.createDefaultStorageItem());
        });
    }

    /**
     * Creates a default storage item with null values for original and editorial content,
     * and sets the modification status to false.
     *
     * @returns A new default storage item.
     */
    private createDefaultStorageItem() {
        return { original: null, editorial: null, isModified: false };
    }

    /**
     * Retrieves the original content of the file associated with the given file path.
     *
     * @param filePath - The file path to retrieve the original content for.
     * @returns The original content of the file, or null if the content is not available.
     */
    protected getOriginal(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem && storageItem.original) {
            return storageItem.original;
        }

        return null;
    }

    /**
     * Sets the original content for the file associated with the given file path.
     *
     * @param filePath - The file path to set the original content for.
     * @param originalContent - The original content to be stored.
     */
    protected setOriginal(filePath: FilePath, originalContent: string) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.original = originalContent;
        }
    }

    /**
     * Retrieves the edited content of the file associated with the given file path.
     *
     * @param filePath - The file path to retrieve the edited content for.
     * @returns The edited content of the file, or null if the content is not available.
     */
    protected getEditorial(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem && storageItem.editorial) {
            return storageItem.editorial;
        }

        return null;
    }

    /**
     * Sets the edited content for the file associated with the given file path.
     *
     * @param filePath - The file path to set the edited content for.
     * @param editorialContent - The edited content to be stored.
     */
    protected setEditorial(filePath: FilePath, editorialContent: string) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.editorial = editorialContent;
        }
    }

    /**
     * Marks the file associated with the given file path as modified.
     *
     * @param filePath - The file path to mark as modified.
     */
    protected setModifiedStatus(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.isModified = true;
        }
    }
}
