import * as vscode from 'vscode';

interface InputFieldProps {
    validateBeforeAccept?: () => void;
}

export class InputField {
    inputBox: vscode.InputBox;
    value: string = '';
    validateBeforeAccept: InputFieldProps['validateBeforeAccept'];

    constructor(params: InputFieldProps) {
        this.inputBox = vscode.window.createInputBox();

        this.inputBox.onDidHide(() => this.inputBox.dispose());
        this.inputBox.onDidAccept(() => this.accept());

        this.inputBox.onDidChangeValue(value => {
            if (this.inputBox.validationMessage !== undefined) {
                this.inputBox.validationMessage;
            }

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
        console.log('onDidAccept');

        if (this.validateBeforeAccept?.()) {
            this.inputBox.validationMessage = '123123123123';
            return;
        }

        this.hide();
    }
}
