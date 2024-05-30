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
    module: string;
};

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

    addExport(payload: ExportPayload) {
        this.exports.push(this._handleExportPayload(payload));
    }

    addImport(payload: ImportPayload) {
        this.imports.push(this._handleImportPayload(payload));
    }

    private _handleExportPayload(payload: ExportPayload) {
        const { type, from, module } = payload;

        switch (type) {
            case ExportType.NAMED:
                return reExportTag`{ ${module} }${from}`;
            default:
                return '';
        }
    }

    private _handleImportPayload(payload: ImportPayload) {
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
