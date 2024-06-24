import { File } from './File';
import type { JavaScriptFileExtension } from '../configuration';

type ComponentFileExtension = JavaScriptFileExtension | 'tsx';

interface ComponentFileSettings {
    componentName: string | undefined;
}

const tag = (_s: TemplateStringsArray, imports: Array<string>, nameExp: string) => {
    const header = imports.join(`\n`);

    const content = `export const ${nameExp} = () => {
  return null;
};`;

    if (header) {
        return `${header}

${content}
`;
    }

    return `${content}
`;
};

export class ComponentFile extends File<ComponentFileExtension> {
    private componentName?: string;

    constructor(name: string = 'Component', extension: JavaScriptFileExtension, settings: ComponentFileSettings) {
        super(name, ComponentFile.addXMLSuffix(extension));

        this.componentName = settings.componentName;
    }

    getInternalName(): string {
        return this.componentName ?? this.name;
    }

    getFileContent(): string {
        return tag`${this.imports}${this.getInternalName()}`;
    }

    static addXMLSuffix(extension: JavaScriptFileExtension) {
        return extension.replace(/(ts)/, '$1' + 'x') as ComponentFileExtension;
    }
}
