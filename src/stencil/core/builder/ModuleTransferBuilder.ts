import { importTag, importGlobalTag, reExportTag } from '../utils/tags';

export enum ImportType {
    DEFAULT = 'default',
    NAMED = 'named',
    GLOBAL = 'global',
}

export enum ExportType {
    NAMED = 'named',
}

export type ExportPayload = {
    type: ExportType.NAMED;
    from: string;
    entry: string;
};

export type ImportPayload = {
    from: string;
} & (
    | {
          type: ImportType.DEFAULT | ImportType.NAMED;
          entry: string;
      }
    | {
          type: ImportType.GLOBAL;
          entry?: undefined;
      }
);

export class ModuleTransferBuilder {
    imports: Array<string> = [];
    exports: Array<string> = [];

    addImport(payload: ImportPayload) {
        this.imports.push(this._handleImportPayload(payload));
    }

    addExport(payload: ExportPayload) {
        this.exports.push(this._handleExportPayload(payload));
    }

    private _handleImportPayload(payload: ImportPayload) {
        const { type, from, entry } = payload;

        switch (type) {
            case ImportType.DEFAULT:
                return importTag`${entry}${from}`;
            case ImportType.NAMED:
                return importTag`{ ${entry} }${from}`;
            case ImportType.GLOBAL:
                return importGlobalTag`${from}`;
            default:
                return '';
        }
    }

    private _handleExportPayload(payload: ExportPayload) {
        const { type, from, entry } = payload;

        switch (type) {
            case ExportType.NAMED:
                return reExportTag`{ ${entry} }${from}`;
            default:
                return '';
        }
    }
}
