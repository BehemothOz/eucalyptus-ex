/**
 * Enum for template keys.
 * @readonly
 * @enum {string}
 */
export enum TemplateKey {
    DIAMOND = 'diamond_template',
    RUBY = 'ruby_template',
    SAPPHIRE = 'sapphire_template',
}

/**
 * Interface for a template manager.
 * @interface
 */
export interface Template {
    /**
     * The key of the template. A unique property.
     */
    key: TemplateKey;
    /**
     * The label of the template. Used for UI display.
     */
    label: string;
    /**
     * The detail description of the template. Used for UI display.
     */
    detail: string;
}

export interface ITemplatesManager {
    /**
     * Gets an array of templates.
     * @returns {Template[]} An array of Template objects.
     */
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

/**
 * Class representing a templates manager.
 * @implements {ITemplatesManager}
 */
export class TemplatesManager implements ITemplatesManager {
    private templates = templates;

    getTemplates() {
        return this.templates;
    }
}
