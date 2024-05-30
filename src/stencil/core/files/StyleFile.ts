import { File } from './File';
import type { StyleFileExtension, Flags } from '../configuration';

interface StyleFileOptions extends Flags {}

export class StyleFile extends File<StyleFileExtension> {
    constructor(name: string, extension: StyleFileExtension, private options: StyleFileOptions) {
        super(name, extension);
    }

    getImportingName() {
        return 'styles';
    }

    getNameWithExtension() {
        let name = this.name;

        if (this.options.useCssModules) {
            name = `${name}.module`;
        }

        return `${name}.${this.extension}`;
    }

    getContent(): string {
        return '';
    }
}
