import type { FileSignature } from '../files';

export interface IFileBuilder {
    addStyleFile: (componentName: string) => this;
    addComponentFile: (componentName: string) => this;
    addIndexFile: (componentName: string) => this;
    build: () => Array<FileSignature>;
}

export interface IFileDirector {
    buildByCoreTemplate: (names: FileNames) => void;
    buildByMajorTemplate: (names: Omit<FileNames, 'styleName'>) => void;
    buildByMinorTemplate: (names: Omit<FileNames, 'indexName'>) => void;
}

export interface FileNames {
    styleName: string;
    componentName: string;
    indexName: string;
}
