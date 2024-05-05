export type TemplateId = 10 | 20;

export interface TemplateDescription {
    id: TemplateId;
    label: string;
    detail: string;
}

export type Template = Array<FILES>;

export enum FILES {
    COMPONENT_FILE = 'component',
    STYLE_FILE = 'style',
    INDEX_FILE = 'index',
}

export type TemplateKeys = Array<keyof Template>;

export const templates: Record<TemplateId, Array<FILES>> = {
    10: [FILES.COMPONENT_FILE, FILES.STYLE_FILE, FILES.INDEX_FILE],
    20: [FILES.COMPONENT_FILE, FILES.INDEX_FILE],
};

export interface ITemplates {
    getTemplateById: (templateId: TemplateId) => Template;
    getTemplatesDescription: () => Array<TemplateDescription>;
}

export class Templates implements ITemplates {
    private templates = templates;
    private templatesDescription: Array<TemplateDescription> = [
        { id: 10, label: 'Full directory', detail: 'Contains the following files: component and index' },
        { id: 20, label: 'Partial directory', detail: 'Contains the following files: component, style and index' },
    ];

    getTemplateById(templateId: TemplateId) {
        return this.templates[templateId];
    }

    getTemplatesDescription() {
        return this.templatesDescription;
    }

    getTemplateKeys(template: Template) {
        return Object.keys(template) as TemplateKeys;
    }
}
