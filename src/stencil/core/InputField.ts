import * as vscode from 'vscode';

export interface AcceptValidatingResult {
    isValid: boolean;
    message: string | undefined;
}

interface InputFieldProps extends vscode.InputBoxOptions {
    validateAccept: (value: string) => { isValid: boolean; message: string | undefined };
}

export class InputField {
    private inputBox: vscode.InputBox;

    private _value: string = '';
    private _inputResolver: ((value?: unknown) => void) | undefined;

    validateAccept: InputFieldProps['validateAccept'];

    constructor(params: InputFieldProps) {
        this.inputBox = vscode.window.createInputBox();

        this.validateAccept = params.validateAccept;

        this.inputBox.placeholder = params.placeHolder;
        this.inputBox.prompt = params.prompt;
        this.inputBox.valueSelection = params.valueSelection;

        this.inputBox.onDidHide(() => this.inputBox.dispose());
        this.inputBox.onDidAccept(() => this.accept());

        this.inputBox.onDidChangeValue(value => {
            console.log(value);
            if (this.inputBox.validationMessage !== undefined) {
                this.inputBox.validationMessage = undefined;
            }

            this._value = value;
        });
    }

    async show() {
        return new Promise(resolve => {
            this._inputResolver = resolve;
            this.inputBox.show();
        });
    }

    hide() {
        this.inputBox.hide();

        if (this._inputResolver) {
            this._inputResolver();
        }
    }

    private accept() {
        const { isValid, message } = this.validateAccept(this._value);

        if (isValid) {
            this.hide();
        } else {
            this.inputBox.validationMessage = message;
        }
    }

    get value() {
        const strippedValue = this._value.trim();

        if (strippedValue) {
            return strippedValue;
        }

        return null;
    }
}

export const showInputField = async (options: InputFieldProps): Promise<string | null> => {
    const input = new InputField(options);

    await input.show();
    return input.value;
};
