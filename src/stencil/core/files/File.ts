import { ModuleTransferBuilder } from '../builder';

export interface FileSignature {
    getName: () => string;
    getNameWithExtension: () => string;
    getContent: () => string;
}

export abstract class File<Extension> extends ModuleTransferBuilder implements FileSignature {
    constructor(private name: string, private extension: Extension) {
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
