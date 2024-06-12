import { File } from './File';
import type { JavaScriptFileExtension } from '../configuration';

const DEFAULT_INDEX_FILE_NAME = 'index';

const tag = (_s: TemplateStringsArray, exports: Array<string>) => {
    return `${exports.join('\n')}
`;
};

export class IndexFile extends File<JavaScriptFileExtension> {
    constructor(name: string = DEFAULT_INDEX_FILE_NAME, extension: JavaScriptFileExtension) {
        super(name, extension);
    }

    getFileContent(): string {
        return tag`${this.exports}`;
    }
}
