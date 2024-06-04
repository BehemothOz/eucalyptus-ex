import type { FileSignature } from '../files';
import type { TemplateKey } from '../templates/Templates';

export interface IFileBuilder {
    /**
     * Adds a style file to the builder.
     */
    addStyleFile: (directory: string) => this;
    /**
     * Adds a component file to the builder.
     */
    addComponentFile: (directory: string, componentName?: string) => this;
    /**
     * Adds an index file to the builder.
     */
    addIndexFile: (directory?: string) => this;
    /**
     * Resets the builder by clearing all files.
     */
    reset: () => void;
    /**
     * Builds the files and returns an array of the built files.
     */
    build: () => Array<FileSignature>;
}

export interface IFileDirector {
    /**
     * Builds files using the diamond template.
     * @param {string} directoryName - The name of the directory.
     */
    buildByDiamondTemplate: (name: string) => void;
    /**
     * Builds files using the ruby template.
     * @param {string} directoryName - The name of the directory.
     */
    buildByRubyTemplate: (name: string) => void;
    /**
     * Builds files using the sapphire template.
     * @param {string} directoryName - The name of the directory.
     */
    buildBySapphireTemplate: (name: string) => void;
    /**
     * Builds files based on the specified template key.
     * @param {TemplateKey} key - The template key.
     * @param {string} name - The name of the directory.
     */
    buildByTemplateKey: (key: TemplateKey, name: string) => void;
}
