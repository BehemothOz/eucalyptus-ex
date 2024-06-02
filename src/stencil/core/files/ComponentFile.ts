import { File } from './File';
import type { JavaScriptFileExtension } from '../configuration';

type ComponentFileExtension = JavaScriptFileExtension | 'tsx';

const tag = (_s: TemplateStringsArray, imports: Array<string>, nameExp: string) => {
    const header = imports.join(`\n`);

    const content = `export const ${nameExp} = () => {
    return null;
};
    `;

    if (header) {
        return `${header}
${content}
    `;
    }

    return `${content}`;
};

export class ComponentFile extends File<ComponentFileExtension> {
    constructor(name: string = 'Component', extension: JavaScriptFileExtension) {
        super(name, ComponentFile.addXMLSuffix(extension));
    }

    getFileContent(): string {
        return tag`${this.imports}${this.name}`;
    }

    static addXMLSuffix(extension: JavaScriptFileExtension) {
        return extension.replace(/(ts)/, '$1' + 'x') as ComponentFileExtension;
    }
}
