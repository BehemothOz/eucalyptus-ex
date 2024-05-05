export interface FileSignature<Extension = string> {
    name: string;
    extension: Extension;

    imports: Array<string>;
    exports: Array<string>;

    getName: () => string;
    getFullName: () => string;
    getContent: () => string;

    addImport: (payload: ImportPayload) => void;
    addExport: (payload: ImportPayload) => void;
}

type ExportDefaultName = string;
type ImportFromName = string;
type ImportPayload = [ExportDefaultName, ImportFromName];

const importTag = (_s: TemplateStringsArray, name: ExportDefaultName, from: ImportFromName) => {
    return `import ${name} from "./${from}";
    `;
};

const exportTag = (_s: TemplateStringsArray, name: ExportDefaultName, from: ImportFromName) => {
    return `export { ${name} } from "./${from}";
    `;
};

export abstract class File<Extension> implements FileSignature<Extension> {
    imports: Array<string> = [];
    exports: Array<string> = [];

    constructor(public name: string, public extension: Extension) {}

    getName() {
        return this.name;
    }

    getFullName() {
        return `${this.name}.${this.extension}`;
    }

    addImport(payload: ImportPayload) {
        this.imports.push(importTag`${payload[0]}${payload[1]}`);
    }

    addExport(payload: ImportPayload) {
        this.exports.push(exportTag`${payload[0]}${payload[1]}`);
    }

    abstract getContent(): string;
}
