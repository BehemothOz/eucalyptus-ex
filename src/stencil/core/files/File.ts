import { ModuleTransferBuilder } from '../builders';

export interface FileSignature {
    getName: () => string;
    getNameWithExtension: () => string;
    getContent: () => string;
}

export abstract class File<Extension> extends ModuleTransferBuilder implements FileSignature {
    constructor(protected name: string, protected extension: Extension) {
        super();
    }

    getName() {
        return this.name;
    }

    getNameWithExtension() {
        return `${this.name}.${this.extension}`;
    }

    abstract getContent(): string;
}
