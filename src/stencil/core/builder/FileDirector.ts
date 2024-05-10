import type { IFileBuilder, FileNames } from './types';

export class FileDirector {
    constructor(private builder: IFileBuilder) {}

    public buildByATemplate(names: FileNames): void {
        this.builder.addStyleFile(names.styleName).addComponentFile(names.componentName).addIndexFile(names.indexName);
    }

    public buildByBTemplate(names: Omit<FileNames, 'styleName'>): void {
        this.builder.addComponentFile(names.componentName).addIndexFile(names.indexName);
    }

    public buildByCTemplate(names: Omit<FileNames, 'indexName'>): void {
        this.builder.addStyleFile(names.styleName).addComponentFile(names.componentName);
    }
}
