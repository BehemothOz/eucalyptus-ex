import { File } from './File';
import type { JavaScriptFileExtension } from '../configuration';

const tag = (_s: TemplateStringsArray, imports: Array<string>, nameExp: string) => {
    const header = imports.join(`\n`);

    return `${header}
export const ${nameExp} = () => {
  return null;
};
`;
};

export class ComponentFile extends File {
    constructor(name: string = 'Component', extension: JavaScriptFileExtension) {
        super(name, 'tsx');
    }

    getContent(): string {
        // return tag`${this.imports}${this.name}`;
        return '';
    }
}
