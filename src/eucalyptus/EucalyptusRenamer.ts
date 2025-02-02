import * as vscode from 'vscode';
import * as path from 'node:path';

import { FileRenamer } from './core/renamer/FileRenamer';

export class EucalyptusRenamer {
    static async rename(directory: vscode.Uri) {
        const fileRenamer = new FileRenamer();

        const dirname = path.basename(directory.fsPath);
        await fileRenamer.analyzeDirectoryFiles(directory, dirname);
    }
}
