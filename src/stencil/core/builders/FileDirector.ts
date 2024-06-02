import { TemplateKey } from '../templates/Templates';
import type { IFileBuilder, IFileDirector } from './types';

export class FileDirector implements IFileDirector {
    /**
     * Creates an instance of FileDirector.
     * @param {IFileBuilder} builder - The builder to be used by the director.
     */
    constructor(private builder: IFileBuilder) {}

    buildByDiamondTemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName).addIndexFile();
    }

    buildByRubyTemplate(directoryName: string): void {
        this.builder.addComponentFile(directoryName).addIndexFile();
    }

    buildBySapphireTemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName);
    }

    buildByTemplateKey(key: TemplateKey, name: string) {
        switch (key) {
            case TemplateKey.DIAMOND:
                this.buildByDiamondTemplate(name);
                break;
            case TemplateKey.RUBY:
                this.buildByRubyTemplate(name);
                break;
            case TemplateKey.SAPPHIRE:
                this.buildBySapphireTemplate(name);
                break;
            default:
                break;
        }
    }
}
