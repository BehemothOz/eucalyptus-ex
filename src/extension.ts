// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Eucalyptus } from './eucalyptus';
import { Configuration } from './eucalyptus/core/configuration';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "eucalyptus" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable =
    const disposable = vscode.commands.registerCommand('eucalyptus.createUIDirectory', async (file: vscode.Uri) => {
        if (!file) {
            vscode.window.showErrorMessage('directory was not found');
            return;
        }

        const vscodeConfiguration = vscode.workspace.getConfiguration('eucalyptus');

        const settings = new Configuration(vscodeConfiguration);
        const eucalyptus = new Eucalyptus(file, settings);

        eucalyptus.initialization();
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
