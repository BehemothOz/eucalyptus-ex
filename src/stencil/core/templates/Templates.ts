

export type TemplateKey = 'template_a' | 'template_b' | 'template_c';

export interface Template {
    key: TemplateKey;
    label: string;
    detail: string;
}

export interface ITemplatesManager {
    getTemplates: () => Array<Template>;
}

export const templates: Array<Template> = [
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

export class TemplatesManager implements ITemplatesManager {
    private templates = templates;

    getTemplates() {
        return this.templates;
    }
}
