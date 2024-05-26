import * as vscode from 'vscode';

import { FileBuilder, FileDirector, type IFileBuilder, type IFileDirector } from './core/builders';
import { Templates, FILES, type ITemplates } from './core/templates/Templates';
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

    private templates: ITemplates;

    private fileBuilder: IFileBuilder;
    private fileDirector: IFileDirector;

    constructor(file: vscode.Uri, settings: StencilSettings) {
        this.file = file;

        this.templates = new Templates();

        this.fileBuilder = new FileBuilder(settings);
        this.fileDirector = new FileDirector(this.fileBuilder);
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions
    */
    private async showInput() {
        const join = (value: string) => fm.joinPath(this.file, value);

        try {
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
        } catch (err) {
            console.log(err);
        }
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick
    */
    private async showQuickPick() {
        // const templateItems = [];
        // return await vscode.window.showQuickPick(templateItems, {
        //     placeHolder: 'Select template',
        // });
    }

    public async initialization() {
        const valueFromInputBox = await this.showInput();

        console.log('valueFromInputBox', valueFromInputBox);

        if (valueFromInputBox) {
        } else {
            return;
        }

        // const selectedTemplate = await this.showQuickPick();
        // const templateId = selectedTemplate?.id as TemplateId;

        // if (selectedTemplate) {
        // } else {
        //     return;
        // }

        // const directoryUri = await this.createDirectory(valueFromInputBox);
        // this.buildFilesByTemplateId(valueFromInputBox, templateId);

        // await this.createFiles(directoryUri);

        return;
    }

    private async createDirectory(name: string) {
        let directoryName = name;

        if (fm.exist(fm.joinPath(this.file, name))) {
            directoryName = `${directoryName} copy`;
        }

        const directoryUri = fm.joinPath(this.file, directoryName);

        await fm.createDirectory(directoryUri);

        return directoryUri;
    }

    // private async createFiles(directoryUri: vscode.Uri) {
    //     const files = this.fileBuilder.build();

    //     const filesPromises = files.map(file => {
    //         const name = file.getFullName();
    //         const fileUri = this.fileManager.joinPath(directoryUri, name);

    //         return this.fileManager.createFile(fileUri, file.getContent());
    //     });

    //     Promise.all(filesPromises);
    // }

    // private buildFilesByTemplateId(name: string, templateId: TemplateId) {
    //     // const templateFiles = this.templates.getTemplateById(templateId);
    // }
}
