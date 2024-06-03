import { ModularSystemTransfer } from '../modular';

export interface FileSignature {
    /**
     * Gets the file name without the extension.
     */
    getFileName: () => string;
    /**
     * Helper method.
     */
    getInternalName: () => string;
    /**
     * Gets the file name with the extension.
     */
    getFileNameWithExtension: () => string;
    /**
     * Gets the content of the file.
     */
    getFileContent: () => string;
}

export abstract class File<Extension> extends ModularSystemTransfer implements FileSignature {
    constructor(protected name: string, protected extension: Extension) {
        super();
    }
    /**
     * @returns {string} The file name.
     */
    getFileName(): string {
        return this.name;
    }
    /**
     * @returns {string} The importing name.
     */
    getInternalName(): string {
        return this.name;
    }
    /**
     * @returns {string} The file name with extension.
     */
    getFileNameWithExtension(): string {
        return `${this.name}.${this.extension}`;
    }
    /**
     * @returns {string} The file content.
     */
    abstract getFileContent(): string;
}
