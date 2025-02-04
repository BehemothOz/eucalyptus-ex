import vscode from 'vscode';

type FilePath = vscode.Uri;

interface FileStorageItem {
    /**
     * original file contents
     */
    original: string | null;
    /**
     * Edited file contents
     */
    editorial: string | null;
    isModified: boolean;
}

export class FileStorage {
    storage: Map<FilePath, FileStorageItem> = new Map();

    constructor(filePaths: Array<FilePath>) {
        filePaths.forEach((filePath) => {
            this.storage.set(filePath, this.createDefaultStorageItem());
        });
    }

    private createDefaultStorageItem() {
        return { original: null, editorial: null, isModified: false };
    }

    protected getOriginal(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem && storageItem.original) {
            return storageItem.original;
        }

        return null;
    }

    protected setOriginal(filePath: FilePath, originalContent: string) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.original = originalContent;
        }
    }

    protected getEditorial(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem && storageItem.editorial) {
            return storageItem.editorial;
        }

        return null;
    }

    protected setEditorial(filePath: FilePath, editorialContent: string) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.editorial = editorialContent;
        }
    }

    protected setModifiedStatus(filePath: FilePath) {
        const storageItem = this.storage.get(filePath);

        if (storageItem) {
            storageItem.isModified = true;
        }
    }
}
