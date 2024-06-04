import * as vscode from 'vscode';

/**
 * Type representing possible style file extensions.
 */
export type StyleFileExtension = 'css' | 'scss' | 'less';
/**
 * Type representing possible JavaScript file extensions.
 */
export type JavaScriptFileExtension = 'js' | 'ts';
/**
 * Interface representing additional settings (only boolean).
 * @interface
 */
export interface Flags {
    useCssModules: boolean;
}

export interface EucalyptusSettings {
    /**
     * Gets the style file extension.
     */
    getStyleFileExtension: () => StyleFileExtension;
    /**
     * Gets the JavaScript file extension.
     */
    getJavaScriptFileExtension: () => JavaScriptFileExtension;
    /**
     * Gets the flag indicating if CSS modules are used.
     */
    getCssModulesUsedFlag: () => boolean;
}

export class Configuration implements EucalyptusSettings {
    /**
     * Creates an instance of Configuration.
     * @param {vscode.WorkspaceConfiguration} settings - The workspace configuration.
     */
    constructor(private settings: vscode.WorkspaceConfiguration) {}

    /**
     * @returns {boolean} True if CSS modules are used, false otherwise.
     */
    getCssModulesUsedFlag(): boolean {
        return this.settings.get<boolean>('useCssModules') ?? false;
    }

    /**
     * @returns {StyleFileExtension} The style file extension.
     */
    getStyleFileExtension(): StyleFileExtension {
        return this.settings.get<StyleFileExtension>('styleFormat') ?? 'css';
    }

    /**
     * @returns {JavaScriptFileExtension} The JavaScript file extension.
     */
    getJavaScriptFileExtension(): JavaScriptFileExtension {
        const needUseTypeScript = this.settings.get<boolean>('useTypescript');

        if (needUseTypeScript === undefined) {
            return 'js';
        }

        return needUseTypeScript ? 'ts' : 'js';
    }
}
