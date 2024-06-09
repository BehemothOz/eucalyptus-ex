import * as vscode from 'vscode';

import { FileBuilder, FileDirector, type IFileBuilder, type IFileDirector } from './core/builders';
import { TemplatesManager, type ITemplatesManager, type Template } from './core/templates';
import { EucalyptusSettings } from './core/configuration';
import { showInputField } from './core/ui';
import { fm } from './core/FileManager';

import type { FileSignature } from './core/files';

/**
 * Checks if a string contains spaces.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string contains spaces, false otherwise.
 */
function hasSpaces(str: string): boolean {
    return /\s/.test(str);
}

export class Eucalyptus {
    private file: vscode.Uri;
    private templates: ITemplatesManager;

    private fileBuilder: IFileBuilder;
    private fileDirector: IFileDirector;

    constructor(file: vscode.Uri, settings: EucalyptusSettings) {
        /**
         * The selected directory where the template files will be added.
         */
        this.file = file;
        /**
         * Managing available templates.
         */
        this.templates = new TemplatesManager();
        /**
         * File build management.
         */
        this.fileBuilder = new FileBuilder(settings);
        /**
         * Extension of the FileBuilder.
         */
        this.fileDirector = new FileDirector(this.fileBuilder);
    }

    /**
     * Initializes the eucalyptus creation process.
     * @returns {Promise<void>}
     */
    public async initialization(): Promise<void> {
        const valueFromInputBox = await this.showInput();

        if (valueFromInputBox) {
        } else {
            return;
        }

        const selectedTemplate = await this.showQuickPick();

        if (selectedTemplate) {
        } else {
            return;
        }

        const directoryUri = await this.createDirectory(valueFromInputBox);
        const files = await this.createFilesByTemplate(valueFromInputBox, selectedTemplate);

        await this.createFiles(directoryUri, files);
    }

    /**
     * Shows an input box to the user.
     * @returns {Promise<string | null>} The user input or undefined if the input was cancelled.
     * @private
     */
    private async showInput(): Promise<string | null> {
        const join = (value: string) => fm.joinPath(this.file, value);

        return await showInputField({
            placeholder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
            validateAccept(value) {
                if (hasSpaces(value)) {
                    return 'The name cannot contain spaces';
                }

                if (fm.exist(join(value))) {
                    return `A folder ${value} already exists at this location`;
                }

                return null;
            },
        });
    }

    /**
     * Shows a quick pick dialog to the user to select a template.
     * @returns {Promise<Template | undefined>} The selected template or undefined if no selection was made.
     * @private
     */
    private async showQuickPick(): Promise<Template | undefined> {
        const options = this.templates.getTemplates();

        return await vscode.window.showQuickPick(options, {
            placeHolder: 'Select template',
        });
    }

    /**
     * Creates a directory with the specified name.
     * @param {string} name - The name of the directory.
     * @returns {Promise<vscode.Uri>} The URI of the created directory.
     * @private
     */
    private async createDirectory(name: string): Promise<vscode.Uri> {
        const directoryUri = fm.joinPath(this.file, name);

        await fm.createDirectory(directoryUri);
        return directoryUri;
    }

    /**
     * Creates files in the specified directory.
     * @param {vscode.Uri} directoryUri - The URI of the directory.
     * @returns {Promise<void>}
     * @private
     */
    private async createFiles(directoryUri: vscode.Uri, files: FileSignature[]) {
        const filesUri: Array<vscode.Uri> = [];

        const filesPromises = files.map(file => {
            const fileName = file.getFileNameWithExtension();
            const fileUri = fm.joinPath(directoryUri, fileName);

            filesUri.push(fileUri);
            return fm.createFile(fileUri, file.getFileContent());
        });

        return Promise.all(filesPromises);
    }

    /**
     * Creates files in a directory based on the specified template.
     * @param {string} name - The name of the directory.
     * @param {Template} template - The template to use for file creation.
     * @returns {Promise<void>}
     * @private
     */
    private async createFilesByTemplate(name: string, template: Template): Promise<FileSignature[]> {
        this.fileDirector.buildByTemplateKey(template.key, name);

        return this.fileBuilder.build();
    }
}
