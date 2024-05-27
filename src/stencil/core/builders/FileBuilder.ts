import { ComponentFile, StyleFile, IndexFile } from '../files';

import type { StencilSettings } from '../configuration';
import type { FileSignature } from '../files';
import type { IFileBuilder } from './types';

export enum FILES {
    COMPONENT_FILE = 'component',
    STYLE_FILE = 'style',
    INDEX_FILE = 'index',
}

export class FileBuilder implements IFileBuilder {
    _files: Map<any, any>;

    constructor(private settings: StencilSettings) {
        this._files = new Map();
    }

    addStyleFile(fileName: string) {
        const extension = this.settings.getStyleFileExtension();
        const useCssModules = this.settings.getCssModulesUsedFlag();

        // const file = new StyleFile(fileName, extension, { useCssModules });

        // this._files.set(FILES.STYLE_FILE, file);
        return this;
    }

    addComponentFile(fileName: string) {
        const extension = this.settings.getJavaScriptFileExtension();
        // const file = new ComponentFile(fileName, extension);

        // this._files.set(FILES.COMPONENT_FILE, file);
        return this;
    }

    addIndexFile(fileName?: string) {
        const extension = this.settings.getJavaScriptFileExtension();
        // const file = new IndexFile(fileName, extension);

        // this._files.set(FILES.INDEX_FILE, file);
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
