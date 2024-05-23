import { File } from './File';
import type { StyleFileExtension, Flags } from '../configuration';

interface StyleFileOptions extends Flags {}

export class StyleFile extends File<StyleFileExtension> {
    constructor(name: string, extension: StyleFileExtension, options: StyleFileOptions) {
        super(`${name}.module`, extension);
    }

    getContent(): string {
        return '';
    }
}
