import * as vscode from 'vscode';

import { FileManager } from './core/FileManager';
import { FileBuilder, type IFileBuilder } from './core/builder/FileBuilder';
import { FileDirector } from './core/FileDirector';

import { Templates, FILES, type ITemplates, type TemplateId } from './core/Templates';

export class Stencil {
    private file: vscode.Uri;

    private templates: ITemplates;
    private fileBuilder: IFileBuilder;
    private fileManager: FileManager;

    constructor(file: vscode.Uri) {
        this.file = file;

        // FileDirector

        this.templates = new Templates();
        this.fileBuilder = new FileBuilder();
        this.fileManager = new FileManager();
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#InputBoxOptions
    */
    private async showInput() {
        return await vscode.window.showInputBox({
            value: '',
            placeHolder: 'New directory',
            prompt: 'Enter the name of the directory',
            valueSelection: [-1, -1],
        });
    }

    /*
        https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick
    */
    private async showQuickPick() {
        const templateItems = [
            { id: 10, label: 'Full directory', detail: 'Contains the following files: component and index' },
            { id: 20, label: 'Partial directory', detail: 'Contains the following files: component, style and index' },
        ];

        return await vscode.window.showQuickPick(templateItems, {
            placeHolder: 'Select template',
        });
    }

    public async initialization() {
        const valueFromInputBox = await this.showInput();

        if (valueFromInputBox) {
        } else {
            return;
        }

        const selectedTemplate = await this.showQuickPick();
        const templateId = selectedTemplate?.id as TemplateId;

        if (selectedTemplate) {
        } else {
            return;
        }

        const directoryUri = await this.createDirectory(valueFromInputBox);
        this.buildFilesByTemplateId(valueFromInputBox, templateId);

        await this.createFiles(directoryUri);

        return;
    }

    private async createDirectory(name: string) {
        const directoryUri = this.fileManager.joinPath(this.file, name);
        await this.fileManager.createDirectory(directoryUri);

        return directoryUri;
    }

    private async createFiles(directoryUri: vscode.Uri) {
        const files = this.fileBuilder.build();

        const filesPromises = files.map(file => {
            const name = file.getFullName();
            const fileUri = this.fileManager.joinPath(directoryUri, name);

            return this.fileManager.createFile(fileUri, file.getContent());
        });

        Promise.all(filesPromises);
    }

    private buildFilesByTemplateId(name: string, templateId: TemplateId) {
        // const templateFiles = this.templates.getTemplateById(templateId);
    }
}
