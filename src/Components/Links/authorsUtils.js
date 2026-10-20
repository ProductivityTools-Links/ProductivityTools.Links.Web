export function parseAuthors(authors) {
    if (authors === null || authors === undefined) {
        return [];
    }
    const rawList = Array.isArray(authors) ? authors : [authors];
    const result = [];
    const seen = new Set();

    for (let i = 0; i < rawList.length; i++) {
        const entry = rawList[i];
        if (entry === null || entry === undefined) continue;
        const parts = String(entry).split(/[,;\n]+/);
        for (let j = 0; j < parts.length; j++) {
            const trimmed = parts[j].trim();
            if (!trimmed) continue;
            const key = trimmed.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                result.push(trimmed);
            }
        }
    }

    return result;
}
