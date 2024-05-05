// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Stencil } from './stencil/index';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "stencil-ui" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('stencil-ui.createFolder', async (file: vscode.Uri) => {
        /*
			root folder: vscode.workspace.getWorkspaceFolder(file)
			configuration: vscode.workspace.getConfiguration('stencil') + .get(key)
			show msg: vscode.window.showInformationMessage('Hello World');
		*/
        const stencil = new Stencil(file);
        stencil.initialization();
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
