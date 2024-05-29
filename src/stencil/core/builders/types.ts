import type { FileSignature } from '../files';

export interface IFileBuilder {
    addStyleFile: (directoryName: string) => this;
    addComponentFile: (directoryName: string) => this;
    addIndexFile: (directoryName?: string) => this;
    build: () => Array<FileSignature>;
}

export interface IFileDirector {
    buildByDiamondTemplate: (name: string) => void;
    buildByRubyTemplate: (name: string) => void;
    buildBySapphireTemplate: (name: string) => void;
}

