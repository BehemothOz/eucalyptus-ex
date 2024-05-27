import type { FileSignature } from '../files';

export interface IFileBuilder {
    addStyleFile: (directoryName: string) => this;
    addComponentFile: (directoryName: string) => this;
    addIndexFile: (directoryName?: string) => this;
    build: () => Array<FileSignature>;
}

export interface IFileDirector {
    buildByATemplate: (name: string) => void;
    buildByBTemplate: (name: string) => void;
    buildByCTemplate: (name: string) => void;
}

