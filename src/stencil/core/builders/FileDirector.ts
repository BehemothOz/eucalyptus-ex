import { TemplateKey } from '../templates/Templates';
import type { IFileBuilder, IFileDirector } from './types';

export class FileDirector implements IFileDirector {
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

    buildByTemplateKey(key: TemplateKey) {
        switch (key) {
            case TemplateKey.DIAMOND:
                this.buildByDiamondTemplate('a');
                break;
            case TemplateKey.RUBY:
                this.buildByRubyTemplate('a');
                break;
            case TemplateKey.SAPPHIRE:
                this.buildBySapphireTemplate('a');
                break;
            default:
                break;
        }
    }
}
