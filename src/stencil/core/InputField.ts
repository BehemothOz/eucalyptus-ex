import * as vscode from 'vscode';

/**
 * Interface representing the result of the validation process.
 */
export interface AcceptValidatingResult {
    isValid: boolean;
    message: string | undefined;
}

/**
 * Interface representing the properties of an input field
 */
interface InputFieldProps extends vscode.InputBoxOptions {
    validateAccept: (value: string) => { isValid: boolean; message: string | undefined };
}

// function getPromiseWithResolvers() {
//     let _resolve, _reject
//     const promise = new Promise((res, rej)=>{
//        _resolve = res;
//        _reject = rej;
//     })
//     return {promise, resolve: _resolve, reject: _reject}
//  }

/**
 * Add an extra level of validation before invoking the provided validation function.
 */
export class InputField {
    private inputBox: vscode.InputBox;

    private _value: string = '';
    private _inputResolver: (() => void) | undefined;

    private validateAccept: InputFieldProps['validateAccept'];

    constructor(params: InputFieldProps) {
        /**
         * Creates a InputBox to let the user enter some text input.
         */
        this.inputBox = vscode.window.createInputBox();
        /**
         * Checking the input value after pressing the "Enter" key.
         */
        this.validateAccept = params.validateAccept;
        /**
         * Optional placeholder shown when no value has been input.
         */
        this.inputBox.placeholder = params.placeHolder;
        /**
         * An optional prompt text providing some ask or explanation to the user.
         */
        this.inputBox.prompt = params.prompt;
        /**
         * Selection range in the input value.
         */
        this.inputBox.valueSelection = params.valueSelection;
        /**
         * An event signaling when the value has changed.
         */
        this.inputBox.onDidHide(() => this.inputBox.dispose());
        /**
         * An event signaling when the user indicated acceptance of the input value.
         */
        this.inputBox.onDidAccept(() => this.accept());
        /**
         * An event signaling when the value has changed.
         */
        this.inputBox.onDidChangeValue(value => {
            if (this.inputBox.validationMessage !== undefined) {
                this.inputBox.validationMessage = undefined;
            }

            this._value = value;
        });
    }

    /**
     * Shows the input box and returns a promise that resolves when the input box is hidden.
     * @returns {Promise<void>} A promise that resolves when the input box is hidden.
     */
    async show(): Promise<void> {
        return new Promise<void>(resolve => {
            this._inputResolver = resolve;
            this.inputBox.show();
        });
    }

    /**
     * Hides the input box and resolves the promise
     */
    hide() {
        this.inputBox.hide();

        if (this._inputResolver) {
            this._inputResolver();
        }
    }

    /**
     * Validates the input value and either hides the input box or shows a validation message.
     * @private
     */
    private accept() {
        const { isValid, message } = this.validateAccept(this._value);

        if (isValid) {
            this.hide();
        } else {
            this.inputBox.validationMessage = message;
        }
    }

    /**
     * Gets the value of the input.
     * @returns {string | null} The value of the input, or null if the value is empty.
     */
    get value(): string | null {
        const strippedValue = this._value.trim();

        if (strippedValue) {
            return strippedValue;
        }

        return null;
    }
}

/**
 * Function to show an input field with the given options.
 * @param {InputFieldProps} options - The options for the input field.
 * @returns {Promise<string | null>} A promise that resolves to the input value or null.
 */
export const showInputField = async (options: InputFieldProps): Promise<string | null> => {
    const input = new InputField(options);

    await input.show();
    return input.value;
};
