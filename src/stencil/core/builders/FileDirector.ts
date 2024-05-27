import { TemplateKey } from '../templates/Templates';
import type { IFileBuilder, IFileDirector } from './types';

function MethodDecorator(target: (...args: any[]) => any, _context: ClassMethodDecoratorContext) {
    console.log(`Logging ${12} function`);
    function replacementMethod(this: any, ...args: any[]) {
        console.log("LOG: Entering method.")
        const result = originalMethod.call(this, ...args);
        console.log("LOG: Exiting method.")
        return result;
    }
}

export class FileDirector implements IFileDirector {
    constructor(private builder: IFileBuilder) {
        const builderRegistry: { [key: string]: Function } = {};
    }

    @MethodDecorator
    public buildByATemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName).addIndexFile();
    }

    public buildByBTemplate(directoryName: string): void {
        this.builder.addComponentFile(directoryName).addIndexFile();
    }

    public buildByCTemplate(directoryName: string): void {
        this.builder.addStyleFile(directoryName).addComponentFile(directoryName);
    }
}
