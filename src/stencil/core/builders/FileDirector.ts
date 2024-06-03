import { TemplateKey } from '../templates/Templates';
import type { IFileBuilder, IFileDirector } from './types';

export class FileDirector implements IFileDirector {
    /**
     * Creates an instance of FileDirector.
     * @param {IFileBuilder} builder - The builder to be used by the director.
     */
    constructor(private builder: IFileBuilder) {}

    buildByDiamondTemplate(directory: string): void {
        this.builder.addStyleFile(directory).addComponentFile(directory).addIndexFile();
    }

    buildByRubyTemplate(directory: string): void {
        this.builder.addComponentFile(directory).addIndexFile();
    }

    buildBySapphireTemplate(directory: string): void {
        this.builder.addStyleFile(directory).addComponentFile(directory);
    }

    buildByEmeraldTemplate(directory: string): void {
        this.builder.addStyleFile(directory).addComponentFile('index', directory);
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
            case TemplateKey.EMERALD:
                this.buildByEmeraldTemplate(name);
                break;
            default:
                break;
        }
    }
}
