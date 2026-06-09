export function isDuplicateKeyError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const code = 'code' in error ? (error as { code: unknown }).code : null;
    if (code === 11000 || code === '11000') return true;

    if ('writeErrors' in error && Array.isArray((error as { writeErrors: unknown }).writeErrors)) {
        return (error as { writeErrors: { code?: number }[] }).writeErrors.some(
            (entry) => entry.code === 11000
        );
    }

    return false;
}
