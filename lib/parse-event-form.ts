type EventFormInput = {
    title: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
};

function getStringField(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

function getArrayField(formData: FormData, key: string): string[] {
    const directValues = formData.getAll(key);
    if (directValues.length > 0) {
        return directValues.flatMap((value) => parseArrayValue(String(value)));
    }

    const indexedValues: string[] = [];
    for (const [fieldKey, fieldValue] of formData.entries()) {
        const match = fieldKey.match(new RegExp(`^${key}\\[(\\d+)\\]$`));
        if (match) {
            indexedValues[Number(match[1])] = String(fieldValue).trim();
        }
    }

    return indexedValues.filter(Boolean);
}

function parseArrayValue(value: string): string[] {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
        try {
            const parsed: unknown = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            return [trimmed];
        }
    }

    return [trimmed];
}

function normalizeMode(mode: string): string {
    const lower = mode.toLowerCase().trim();

    if (['online', 'offline', 'hybrid'].includes(lower)) {
        return lower;
    }

    if (lower.includes('hybrid')) return 'hybrid';
    if (lower.includes('online')) return 'online';
    if (lower.includes('offline') || lower.includes('in-person')) return 'offline';

    return lower;
}

export function parseEventFormData(formData: FormData): EventFormInput {
    return {
        title: getStringField(formData, 'title'),
        description: getStringField(formData, 'description'),
        overview: getStringField(formData, 'overview'),
        image: getStringField(formData, 'image'),
        venue: getStringField(formData, 'venue'),
        location: getStringField(formData, 'location'),
        date: getStringField(formData, 'date'),
        time: getStringField(formData, 'time'),
        mode: normalizeMode(getStringField(formData, 'mode')),
        audience: getStringField(formData, 'audience'),
        agenda: getArrayField(formData, 'agenda'),
        organizer: getStringField(formData, 'organizer'),
        tags: getArrayField(formData, 'tags'),
    };
}
