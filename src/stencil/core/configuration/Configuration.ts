import * as vscode from 'vscode';

export type StyleFileExtension = 'css' | 'scss' | 'less';
export type JavaScriptFileExtension = 'js' | 'ts';

interface IConfiguration {
    getStyleFileExtension: () => StyleFileExtension;
    getJavaScriptFileExtension: () => JavaScriptFileExtension;
    getCssModulesUsedFlag: () => boolean;
}

export class Configuration implements IConfiguration {
    constructor(private settings: vscode.WorkspaceConfiguration) {}

    getCssModulesUsedFlag(): boolean {
        return this.settings.get<boolean>('useCssModules') ?? false;
    }

    getStyleFileExtension() {
        return this.settings.get<StyleFileExtension>('styleFormat') ?? 'css';
    }

    getJavaScriptFileExtension() {
        const needUseTypeScript = this.settings.get<boolean>('useTypescript');

        if (needUseTypeScript === undefined) {
            return 'js';
        }

        return needUseTypeScript ? 'ts' : 'js';
    }
}
