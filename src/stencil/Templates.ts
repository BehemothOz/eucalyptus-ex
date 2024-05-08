export type TemplateKey = 'template_a' | 'template_b' | 'template_c';

export interface TemplateDescription {
    key: TemplateKey;
    label: string;
    detail: string;
}

export enum FILES {
    COMPONENT_FILE = 'component',
    STYLE_FILE = 'style',
    INDEX_FILE = 'index',
}

export type Template = Array<FILES>;

export interface ITemplates {
    getTemplateByKey: (key: TemplateKey) => Template;
    getTemplatesDescriptions: () => Array<TemplateDescription>;
}

export const templates: Record<TemplateKey, Template> = {
    template_a: [FILES.COMPONENT_FILE, FILES.STYLE_FILE, FILES.INDEX_FILE],
    template_b: [FILES.COMPONENT_FILE, FILES.INDEX_FILE],
    template_c: [FILES.COMPONENT_FILE, FILES.STYLE_FILE],
};

export const templatesDescriptions: Array<TemplateDescription> = [
    {
        key: 'template_a',
        label: 'Template A',
        detail: 'Contains the following files: component, style and index',
    },
    {
        key: 'template_b',
        label: 'Template B',
        detail: 'Contains the following files: component and index',
    },
    {
        key: 'template_c',
        label: 'Template C',
        detail: 'Contains the following files: component and style',
    },
];

export class Templates implements ITemplates {
    private templates = templates;
    private templatesDescriptions = templatesDescriptions;

    getTemplateByKey(key: TemplateKey) {
        return this.templates[key];
    }

    getTemplatesDescriptions() {
        return this.templatesDescriptions;
    }
}
