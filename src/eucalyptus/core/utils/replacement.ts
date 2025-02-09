/**
 * Represents a replacement operation, specifying what to replace and what to replace it with.
 */
export interface Replacement {
    from: string;
    to: string;
}

export function createReplacement(from: string, to: string): Replacement {
    return { from, to };
}
