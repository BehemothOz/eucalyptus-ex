export const importTag = (_s: TemplateStringsArray, name: string, from: string) => {
    return `import ${name} from "./${from}";
    `;
};

export const importGlobalTag = (_s: TemplateStringsArray, from: string) => {
    return `import "./${from}";
    `;
};

export const reExportTag = (_s: TemplateStringsArray, name: string, from: string) => {
    return `export { ${name} } from "./${from}";
    `;
};
