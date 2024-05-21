import * as vscode from 'vscode';

import { FileBuilder, FileDirector, type IFileBuilder, type IFileDirector } from './core/builders';
import { Templates, FILES, type ITemplates } from './core/Templates';
import { showInputField, type AcceptValidatingResult } from './core/InputField';
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

    // private fileBuilder: IFileBuilder; // + options
    // private fileDirector: IFileDirector;

    constructor(file: vscode.Uri) {
        this.file = file;

        this.templates = new Templates();

        // this.fileBuilder = new FileBuilder();
        // this.fileDirector = new FileDirector(this.fileBuilder);
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions
    */
    private async showInput() {
        const join = (value: string) => fm.joinPath(this.file, value);

        return await showInputField({
            placeHolder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
            validateAccept(value) {
                const result: AcceptValidatingResult = { isValid: true, message: undefined };

                // if (hasSpaces(value)) {
                //     result.isValid = false;
                //     result.message = 'The name cannot contain spaces';

                //     return result;
                // }

                if (isExistDirectory(join(value))) {
                    result.isValid = false;
                    result.message = `A folder ${value} already exists at this location`;
                }

                return result;
            },
        });
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

        // if (valueFromInputBox) {
        // } else {
        //     return;
        // }

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
