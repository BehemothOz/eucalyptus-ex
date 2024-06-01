import { ModularSystemTransfer } from '../modular';

export interface FileSignature {
    getFileName: () => string;
    getImportingName: () => string;
    getFileNameWithExtension: () => string;
    getFileContent: () => string;
}

export abstract class File<Extension> extends ModularSystemTransfer implements FileSignature {
    constructor(protected name: string, protected extension: Extension) {
        super();
        this.name = name;
        this.extension = extension;
    }

    getFileName() {
        return this.name;
    }

    getImportingName() {
        return this.name;
    }

    getFileNameWithExtension() {
        return `${this.name}.${this.extension}`;
    }

    abstract getFileContent(): string;
}
