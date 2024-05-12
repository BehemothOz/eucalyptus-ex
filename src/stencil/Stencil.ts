import * as vscode from 'vscode';

import { FileBuilder, FileDirector, type IFileBuilder, type IFileDirector } from './core/builders';
import { Templates, FILES, type ITemplates } from './core/Templates';
import { fm } from './core/FileManager';

class InputField {
    inputBox: vscode.InputBox;
    value: string = '';

    // validateInput

    constructor() {
        this.inputBox = vscode.window.createInputBox();

        this.inputBox.onDidHide(() => this.inputBox.dispose());
        this.inputBox.onDidAccept(v => {
            console.log('onDidAccept', v);
        });
        this.inputBox.onDidChangeValue(value => {
            this.value = value;
        });
    }

    show() {
        this.inputBox.show();
    }

    hide() {
        this.inputBox.hide();
    }

    accept() {
        this.inputBox.validationMessage = '123123123123';
    }
}

export class Stencil {
    private file: vscode.Uri;

    private templates: ITemplates;

    // private fileBuilder: IFileBuilder;
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
        const input = new InputField();
        input.show();
        // this.input = vscode.window.createInputBox();
        // return await vscode.window.showInputBox({
        //     value: '',
        //     placeHolder: 'New directory',
        //     prompt: 'Enter the name of the directory',
        //     valueSelection: [-1, -1],
        //     validateInput(value) {
        //         console.log(value);
        //         return null;
        //     }
        // });
        // onDidAccept: Event<void>
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
