import type { FileSignature } from '../files';

export interface IFileBuilder {
    addStyleFile: (componentName: string) => this;
    addComponentFile: (componentName: string) => this;
    addIndexFile: (componentName: string) => this;
    build: () => Array<FileSignature>;
}

export interface IFileDirector {
    buildByATemplate: (names: FileNames) => void;
    buildByBTemplate: (names: Omit<FileNames, 'styleName'>) => void;
    buildByCTemplate: (names: Omit<FileNames, 'indexName'>) => void;
}

export interface FileNames {
    styleName: string;
    componentName: string;
    indexName: string;
}
