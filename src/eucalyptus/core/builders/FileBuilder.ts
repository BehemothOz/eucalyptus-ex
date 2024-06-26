import { ComponentFile, StyleFile, IndexFile } from '../files';
import { ImportType, ExportType } from '../modular';

import type { EucalyptusSettings } from '../configuration';
import type { FileSignature } from '../files';
import type { IFileBuilder } from './types';

/**
 * Enum representing different file types.
 * @readonly
 * @enum {string}
 */
export enum FILES {
    COMPONENT_FILE = 'component',
    STYLE_FILE = 'style',
    INDEX_FILE = 'index',
}

export class FileBuilder implements IFileBuilder {
    /**
     * Map to store files being built.
     * @private
     */
    private _files: Map<FILES, FileSignature>;

    constructor(private settings: EucalyptusSettings) {
        this._files = new Map();
    }

    addStyleFile(fileName: string) {
        const extension = this.settings.getStyleFileExtension();
        const useCssModules = this.settings.getCssModulesUsedFlag();

        const file = new StyleFile(fileName, extension, { useCssModules });

        this._files.set(FILES.STYLE_FILE, file);
        return this;
    }

    addComponentFile(fileName: string, componentName?: string) {
        const extension = this.settings.getJavaScriptFileExtension();
        const useCssModules = this.settings.getCssModulesUsedFlag();

        const file = new ComponentFile(fileName, extension, { componentName });

        const styleFile = this._files.get(FILES.STYLE_FILE);

        /*
            Handle other types of css imports
        */
        if (styleFile && useCssModules) {
            file.addImport({
                type: ImportType.DEFAULT,
                module: styleFile.getInternalName(),
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
                module: componentFile.getInternalName(),
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
