import { importTag, importGlobalTag, reExportTag } from '../utils/tags';

/**
 * Enum for import types.
 * @readonly
 * @enum {string}
 */
export enum ImportType {
    DEFAULT = 'default',
    NAMED = 'named',
    GLOBAL = 'global',
}

/**
 * Enum for export types.
 * @readonly
 * @enum {string}
 */
export enum ExportType {
    NAMED = 'named',
}

/**
 * @property {string} from - The source module.
 * @property {ExportType} type - The type of the export.
 * @property {string} module - The module being exported.
 */
type ExportPayload = {
    from: string;
    type: ExportType.NAMED;
    module: string;
};

/**
 * @property {string} from - The source module.
 * @property {ImportType} type - The type of the import.
 * @property {string} [module] - The module being imported (optional for global imports).
 */
type ImportPayload = {
    from: string;
} & (
    | {
          type: ImportType.DEFAULT | ImportType.NAMED;
          module: string;
      }
    | {
          type: ImportType.GLOBAL;
          module?: undefined;
      }
);

export class ModularSystemTransfer {
    exports: Array<string> = [];
    imports: Array<string> = [];

    /**
     * @param {ExportPayload} payload - The payload for the export.
     */
    addExport(payload: ExportPayload) {
        this.exports.push(this._handleExportPayload(payload));
    }

    /**
     * @param {ImportPayload} payload - The payload for the import.
     */
    addImport(payload: ImportPayload) {
        this.imports.push(this._handleImportPayload(payload));
    }

    /**
     * Handles the export payload and returns.
     * @private
     * @param {ExportPayload} payload - The payload for the export.
     * @returns {string} The formatted export tag.
     */
    private _handleExportPayload(payload: ExportPayload): string {
        const { type, from, module } = payload;

        switch (type) {
            case ExportType.NAMED:
                return reExportTag`{ ${module} }${from}`;
            default:
                return '';
        }
    }

    /**
     * Handles the import payload
     * @private
     * @param {ImportPayload} payload - The payload for the import.
     * @returns {string} The formatted import tag.
     */
    private _handleImportPayload(payload: ImportPayload): string {
        const { type, from, module } = payload;

        switch (type) {
            case ImportType.DEFAULT:
                return importTag`${module}${from}`;
            case ImportType.NAMED:
                return importTag`{ ${module} }${from}`;
            case ImportType.GLOBAL:
                return importGlobalTag`${from}`;
            default:
                return '';
        }
    }
}
