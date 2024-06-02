import * as vscode from 'vscode';

import { FileBuilder, FileDirector, type IFileBuilder, type IFileDirector } from './core/builders';
import { TemplatesManager, type ITemplatesManager, type TemplateKey, type Template } from './core/templates/Templates';
import { StencilSettings } from './core/configuration';

import { showInputField } from './core/InputField';
import { fm } from './core/FileManager';

function hasSpaces(str: string): boolean {
    return /\s/.test(str);
}

function isExistDirectory(directoryPath: vscode.Uri): boolean {
    return fm.exist(directoryPath);
}

export class Stencil {
    private file: vscode.Uri;

    private templates: ITemplatesManager;

    private fileBuilder: IFileBuilder;
    private fileDirector: IFileDirector;

    constructor(file: vscode.Uri, settings: StencilSettings) {
        this.file = file;

        this.templates = new TemplatesManager();

        this.fileBuilder = new FileBuilder(settings);
        this.fileDirector = new FileDirector(this.fileBuilder);
    }

    private async showInput() {
        const join = (value: string) => fm.joinPath(this.file, value);

        return await showInputField({
            placeholder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
            validateAccept(value) {
                if (hasSpaces(value)) {
                    return 'The name cannot contain spaces';
                }

                if (isExistDirectory(join(value))) {
                    return `A folder ${value} already exists at this location`;
                }

                return null;
            },
        });
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick
    */
    private async showQuickPick() {
        const options = this.templates.getTemplates();

        return await vscode.window.showQuickPick(options, {
            placeHolder: 'Select template',
        });
    }

    public async initialization() {
        const valueFromInputBox = await this.showInput();

        console.log('valueFromInputBox', valueFromInputBox);

        if (valueFromInputBox) {
        } else {
            return;
        }

        const selectedTemplate = await this.showQuickPick();

        console.log('selectedTemplate', selectedTemplate);

        if (selectedTemplate) {
        } else {
            return;
        }

        const directoryUri = await this.createDirectory(valueFromInputBox);
        this.createFilesByTemplate(valueFromInputBox, selectedTemplate);

        // await this.createFiles(directoryUri);

        return;
    }

    private async createDirectory(name: string) {
        const directoryUri = fm.joinPath(this.file, name);

        // await fm.createDirectory(directoryUri);
        return directoryUri;
    }

    private async createFiles(directoryUri: vscode.Uri) {
        // const filesPromises = files.map(file => {
        //     const name = file.getFullName();
        //     const fileUri = this.fileManager.joinPath(directoryUri, name);
        //     return this.fileManager.createFile(fileUri, file.getContent());
        // });
        // Promise.all(filesPromises);
    }

    private async createFilesByTemplate(name: string, template: Template) {
        this.fileDirector.buildByTemplateKey(template.key, name);

        const files = this.fileBuilder.build();

        files.forEach(file => {
            console.group('FILE');
            console.log('file', file);
            console.log(file.getFileNameWithExtension());
            console.log(file.getFileContent());
            console.groupEnd();
        });
    }
}
