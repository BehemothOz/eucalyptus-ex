import { ComponentFile, StyleFile, IndexFile } from '../files';
import { FILES } from '../Templates';

import type { FileSignature } from '../files';
import type { IFileBuilder } from './types';

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

        if (this._files.has(FILES.STYLE_FILE)) {
            file.addImport(['styles', this._files.get(FILES.STYLE_FILE)!.getFullName()]);
        }

        this._files.set(FILES.INDEX_FILE, file);

        return this;
    }

    reset() {
        this._files.clear();
    }

    build() {
        const result = Array.from(this._files.values());

        this.reset();
        return result;
    }
}
