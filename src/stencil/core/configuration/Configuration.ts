import * as vscode from 'vscode';

export type StyleFileExtension = 'css' | 'scss' | 'less';
export type JavaScriptFileExtension = 'js' | 'ts';

export class Configuration {
    constructor(private settings: vscode.WorkspaceConfiguration) {}

    needUseCssModules(): boolean {
        return this.settings.get<boolean>('useCssModules') ?? false;
    }

    getStyleFileExtension() {
        const styleFormat = this.settings.get('styleFormat');
        return;
    }

    getJavaScriptFileExtension() {
        const needUseTypeScript = this.settings.get('useTypescript');

        if (needUseTypeScript) {
            return 'ts';
        }

        return 'js';
    }
}
