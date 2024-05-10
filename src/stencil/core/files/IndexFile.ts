import { File } from './File';

type IndexFileExtension = 'ts';

const tag = (_s: TemplateStringsArray, exports: Array<string>) => {
    return exports.join('\n');
};

export class IndexFile extends File<IndexFileExtension> {
    constructor(name: string) {
        super('index', 'ts');
    }

    getContent(): string {
        return tag`${this.exports}`;
    }
}
