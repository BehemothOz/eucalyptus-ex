export class CommandRenamerError extends Error {
    constructor(message: string) {
        const prefix = `[CommandRenamerError]`;
        super(`${prefix} ${message}`);

        this.name = 'RenamerError';
    }
}

export function isCommandRenamerError(error: unknown): error is CommandRenamerError {
    return error instanceof CommandRenamerError;
}
