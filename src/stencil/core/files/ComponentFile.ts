import { File } from './File';

type ComponentFileExtension = 'tsx' | 'ts';

const tag = (_s: TemplateStringsArray, imports: Array<string>, nameExp: string) => {
    const header = imports.join(`\n`);

    return `${header}
export const ${nameExp} = () => {
  return null;
};
`;
};

export class ComponentFile extends File<ComponentFileExtension> {
    constructor(name: string = 'Component') {
        super(name, 'tsx');
    }

    getContent(): string {
        return tag`${this.imports}${this.name}`;
    }
}
