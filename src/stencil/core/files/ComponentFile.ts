import { File } from './File';
import type { JavaScriptFileExtension, Flags } from '../configuration';

interface ComponentFileOptions extends Flags {}

const tag = (_s: TemplateStringsArray, imports: Array<string>, nameExp: string) => {
    const header = imports.join(`\n`);

    return `${header}
export const ${nameExp} = () => {
  return null;
};
`;
};

export class ComponentFile extends File<JavaScriptFileExtension> {
    constructor(name: string = 'Component', extension: JavaScriptFileExtension, options: ComponentFileOptions) {
        super(name, 'ts');
    }

    getContent(): string {
        // return tag`${this.imports}${this.name}`;
        return '';
    }
}
