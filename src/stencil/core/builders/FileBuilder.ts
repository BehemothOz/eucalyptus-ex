import { ComponentFile, StyleFile, IndexFile } from '../files';

import type { StencilSettings } from '../configuration';
import type { FileSignature } from '../files';
import type { IFileBuilder } from './types';
import { ImportType, ExportType } from '../modular/ModularSystemTransfer';

export enum FILES {
    COMPONENT_FILE = 'component',
    STYLE_FILE = 'style',
    INDEX_FILE = 'index',
}

export class FileBuilder implements IFileBuilder {
    _files: Map<FILES, FileSignature>;

    constructor(private settings: StencilSettings) {
        this._files = new Map();
    }

    addStyleFile(fileName: string) {
        const extension = this.settings.getStyleFileExtension();
        const useCssModules = this.settings.getCssModulesUsedFlag();

        const file = new StyleFile(fileName, extension, { useCssModules });

        this._files.set(FILES.STYLE_FILE, file);
        return this;
    }

    addComponentFile(fileName: string) {
        const extension = this.settings.getJavaScriptFileExtension();
        const file = new ComponentFile(fileName, extension);

        const styleFile = this._files.get(FILES.STYLE_FILE);

        if (styleFile) {
            file.addImport({
                type: ImportType.DEFAULT,
                module: styleFile.getImportingName(),
                from: styleFile.getFileNameWithExtension(),
            });
        }

        this._files.set(FILES.COMPONENT_FILE, file);
        return this;
    }

    addIndexFile(fileName?: string) {
        const extension = this.settings.getJavaScriptFileExtension();
        const file = new IndexFile(fileName, extension);

        const componentFile = this._files.get(FILES.COMPONENT_FILE);

        if (componentFile) {
            file.addExport({
                type: ExportType.NAMED,
                module: componentFile.getImportingName(),
                from: componentFile.getFileName(),
            });
        }

        this._files.set(FILES.INDEX_FILE, file);
        return this;
    }

    reset() {
        this._files.clear();
    }

    build() {
        const files = Array.from(this._files.values());

        this.reset();
        return files;
    }
}
