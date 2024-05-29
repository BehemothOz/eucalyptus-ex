export enum TemplateKey {
    DIAMOND = 'diamond_template',
    RUBY = 'ruby_template',
    SAPPHIRE = 'sapphire_template',
}

export interface Template {
    key: TemplateKey;
    label: string;
    detail: string;
}

export interface ITemplatesManager {
    getTemplates: () => Array<Template>;
}

const templates: Array<Template> = [
    {
        key: TemplateKey.DIAMOND,
        label: 'Diamond Template',
        detail: 'Contains files: component, style and index',
    },
    {
        key: TemplateKey.RUBY,
        label: 'Ruby Template',
        detail: 'Contains files: component and index',
    },
    {
        key: TemplateKey.SAPPHIRE,
        label: 'Sapphire Template',
        detail: 'Contains files: component and style',
    },
];

export class TemplatesManager implements ITemplatesManager {
    private templates = templates;

    getTemplates() {
        return this.templates;
    }
}
