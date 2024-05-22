import { File } from './File';
import type { JavaScriptFileExtension } from '../configuration';

const tag = (_s: TemplateStringsArray, exports: Array<string>) => {
    return exports.join('\n');
};

export class IndexFile extends File {
    constructor(name: string, extension: JavaScriptFileExtension) {
        super('index', extension);
    }

    getContent(): string {
        return tag`${this.exports}`;
    }
}
