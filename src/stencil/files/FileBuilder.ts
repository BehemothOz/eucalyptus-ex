import { FileSignature } from './File';
import { ComponentFile, StyleFile, IndexFile } from './types';
import { FILES } from '../Templates';

export interface IFileBuilder {
    addStyleFile: (componentName: string) => this;
    addComponentFile: (componentName: string) => this;
    addIndexFile: (componentName: string) => this;
    build: () => Array<FileSignature>;
}

export class FileBuilder implements IFileBuilder {
    _files: Map<FILES, FileSignature>;

    constructor() {
        this._files = new Map();
    }

    addStyleFile(fileName: string) {
        const file = new StyleFile(fileName);
        this._files.set(FILES.STYLE_FILE, file);

        return this;
    }

    addComponentFile(fileName: string) {
        const file = new ComponentFile(fileName);
        this._files.set(FILES.COMPONENT_FILE, file);

        return this;
    }

    addIndexFile(fileName: string) {
        const file = new IndexFile(fileName);
        this._files.set(FILES.INDEX_FILE, file);

        return this;
    }

    build() {
        const componentFile = this._files.get(FILES.COMPONENT_FILE)!;
        const indexFile = this._files.get(FILES.INDEX_FILE)!;

        if (this._files.has(FILES.STYLE_FILE)) {
            const styleFile = this._files.get(FILES.STYLE_FILE)!;

            componentFile.addImport(['styles', styleFile.getFullName()]);
        }

        indexFile.addExport([componentFile.getName(), componentFile.getName()]);

        return Array.from(this._files.values());
    }
}
