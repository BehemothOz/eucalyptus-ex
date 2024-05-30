import { ModularSystemTransfer } from '../modular';

export interface FileSignature {
    getName: () => string;
    getImportingName: () => string;
    getNameWithExtension: () => string;
    getContent: () => string;
}

export abstract class File<Extension> extends ModularSystemTransfer implements FileSignature {
    constructor(protected name: string, protected extension: Extension) {
        super();
        this.name = name;
        this.extension = extension;
    }

    getName() {
        return this.name;
    }

    getImportingName() {
        return this.name;
    }

    getNameWithExtension() {
        return `${this.name}.${this.extension}`;
    }

    abstract getContent(): string;
}
