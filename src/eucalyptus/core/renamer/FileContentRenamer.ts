import vscode from 'vscode';
import { fm } from '../FileManager';

type FilePath = vscode.Uri;

type FileStorageItem = {
    original: string | null;
    editorial: string | null;
    isModified: boolean;
};

class StorageRenamer {
    storage: Map<FilePath, FileStorageItem> = new Map();

    constructor(filePaths: Array<FilePath>) {
        filePaths.forEach((filePath) => {
            const defaultStorageItem: FileStorageItem = {
                original: null,
                editorial: null,
                isModified: false,
            };

            this.storage.set(filePath, defaultStorageItem);
        });
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

const searchPhrase = '';
const replacement = '';

export class FileContentRenamer extends StorageRenamer {
    constructor(private filePaths: Array<vscode.Uri>) {
        super(filePaths);
    }

    private async readFilesContent() {
        const promises = this.filePaths.map(async (filePath) => {
            try {
                const fileContent = await fm.readFile(filePath);
                this.setOriginal(filePath, fileContent);
            } catch (error) {
                console.log('Read File Content Error', error);
            }
        });

        return await Promise.all(promises);
    }

    private async writeFilesContent() {
        const promises = this.filePaths.map(async (filePath) => {
            const editorialContent = this.getEditorial(filePath);

            if (editorialContent === null) {
                return null;
            }

            try {
                await fm.writeFile(filePath, editorialContent);
                this.setModifiedStatus(filePath);
            } catch (error) {
                console.log('Read File Content Error', error);
            }
        });

        return await Promise.all(promises);
    }

    private replace() {
        const regExp = new RegExp(searchPhrase, 'g');

        this.filePaths.forEach((filePath) => {
            const originalContent = this.getOriginal(filePath);

            if (originalContent) {
                const editorialContent = originalContent.replace(regExp, replacement);
                this.setEditorial(filePath, editorialContent);
            }
        });
    }

    rollback() {
        /*
            catch block
        */
        for (const filePath of this.filePaths) {
            try {
                console.log("this.storage", this.storage);
                // await fs.writeFile(filePath, cache[filePath], 'utf8');
                // console.log(`Файл ${filePath} восстановлен.`);
            } catch (rollbackErr) {
                console.error(`Ошибка при восстановлении файла ${filePath}:`, rollbackErr);
            }
        }
    }

    clear() {
        // this.cache.clear();
    }
}
