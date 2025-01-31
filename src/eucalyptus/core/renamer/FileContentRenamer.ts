type FilePath = string;
type FileContent = string;

export class FileContentRenamer {
    cache: Map<FilePath, FileContent> = new Map();

    constructor() {
    }

    readFileContent() {
        /*
            for (const filePath of filePaths) {
                const data = await fs.readFile(filePath, 'utf8');
                cache[filePath] = data;
            }
        */
    }

    replace() {
        /*
            const newData = dataCache[filePath].replace(new RegExp(searchPhrase, 'g'), replacement);
            cache[filePath] = newData; // Обновляем кэш
        */
    }

    write() {
        /*
            await fs.writeFile(filePath, cache[filePath], 'utf8');
            successfulFiles.push(filePath); // Отмечаем успешно измененный файл
        */
    }

    rollback() {
        /*  catch block
            for (const filePath of successfulFiles) {
                try {
                    await fs.writeFile(filePath, cache[filePath], 'utf8');
                    console.log(`Файл ${filePath} восстановлен.`);
                } catch (rollbackErr) {
                    console.error(`Ошибка при восстановлении файла ${filePath}:`, rollbackErr);
                }
            }
        */
    }

    clear() {
        this.cache.clear();
    }
}
