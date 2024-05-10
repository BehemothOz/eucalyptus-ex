import { importTag, importGlobalTag, reExportTag } from '../utils/tags';

export enum ImportType {
    DEFAULT = 'default',
    NAMED = 'named',
    GLOBAL = 'global',
}

export enum ExportType {
    NAMED = 'named',
}

type ExportPayload = {
    type: ExportType.NAMED;
    from: string;
    entry: string;
};

type ImportPayload = {
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
    exports: Array<string> = [];
    imports: Array<string> = [];

    addExport(payload: ExportPayload) {
        this.exports.push(this._handleExportPayload(payload));
    }

    addImport(payload: ImportPayload) {
        this.imports.push(this._handleImportPayload(payload));
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
}
