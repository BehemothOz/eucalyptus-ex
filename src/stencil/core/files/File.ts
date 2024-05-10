export interface FileSignature<Extension = string> {
    name: string;
    extension: Extension;

    getName: () => string;
    getNameWithExtension: () => string;
    getContent: () => string;
}

export abstract class File<Extension> implements FileSignature<Extension> {
    constructor(public name: string, public extension: Extension) {}

    getName() {
        return this.name;
    }

    getNameWithExtension() {
        return `${this.name}.${this.extension}`;
    }

    abstract getContent(): string;
}
