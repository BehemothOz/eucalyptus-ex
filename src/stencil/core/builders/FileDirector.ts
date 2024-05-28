import { TemplateKey } from '../templates/Templates';
import type { IFileBuilder, IFileDirector } from './types';

enum Some {
    TEMPLATE_A = 'template_a',
    TEMPLATE_B = 'template_b',
    TEMPLATE_C = 'template_c',
}

export class FileDirector implements IFileDirector {
    constructor(private builder: IFileBuilder) {}

    buildByATemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName).addIndexFile();
    }

    buildByBTemplate(directoryName: string): void {
        this.builder.addComponentFile(directoryName).addIndexFile();
    }

    buildByCTemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName);
    }

    build(key: TemplateKey) {
        switch (key) {
            case Some.TEMPLATE_A:
                this.buildByATemplate('a');
                break;
            case Some.TEMPLATE_A:
                this.buildByBTemplate('a');
                break;
            case Some.TEMPLATE_A:
                this.buildByCTemplate('a');
                break;
            default:
                break;
        }
    }
}
