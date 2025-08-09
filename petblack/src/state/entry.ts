export type KeyValuePair<TKey = string, TValue = unknown> = [TKey, TValue];

export type Entry<TValue = unknown, TKey extends string = string, TVariant = unknown | never, TSpread = TVariant> = [TKey, TValue] | [TKey, TValue, TVariant] | [TKey, TValue, TVariant, ...TSpread[]];

export type RecursiveEntry<TValue = unknown> = [string, TValue, ...RecursiveEntry<TValue>[]];

export const getIn = <TValue = unknown>(
    entry: RecursiveEntry<TValue>[],
    path: string[]
): unknown => {
    let current: RecursiveEntry<TValue>[] = entry;
    for (const key of path) {
        let index = -1;
        for (let i = 2;i < current.length;i++) {
            if (current[i][0] === key) {
                index = i;
                break;
            }
        }
        if (index === -1) return undefined;
        current = current[index] as RecursiveEntry<TValue>[];
    }
    return current.length > 0 ? current[0][1] : undefined;
};

export const setIn = <TValue>(
    entry: RecursiveEntry<TValue>[],
    path: string[],
    value: TValue
): RecursiveEntry<TValue>[] => {
    const result = [...entry];
    let current: RecursiveEntry<TValue>[] = result;

    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
        const key = path[pathIndex];
        let index = -1;
        for (let i = 2; i < current.length; i++) {
            if (current[i][0] === key) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            const newEntry: RecursiveEntry<TValue> = [key, pathIndex === path.length - 1 ? value : null as unknown as TValue];
            if (pathIndex < path.length - 1) newEntry.push(...[] as RecursiveEntry<TValue>[]);
            current.push(newEntry);
            current = newEntry.slice(2) as RecursiveEntry<TValue>[];
        } else {
            const item = current[index];
            if (pathIndex === path.length - 1) {
                item[1] = value;
            } else {
                if (item.length <= 2) item.push(...[] as RecursiveEntry<TValue>[]);
                current = item.slice(2) as RecursiveEntry<TValue>[];
            }
        }
    }
    return result;
};

export const getAt = <TValue>(entry: RecursiveEntry<TValue>[], path: number[]): unknown => {
    let current: RecursiveEntry<TValue>[] = entry;
    for (const index of path) {
        if (index >= current.length || index < 2) return undefined; // Index must be at least 2 since we start from the third element
        if (current[index].length > 2) {
            current = current[index].slice(2) as RecursiveEntry<TValue>[];
        } else {
            return current[index][1];
        }
    }
    return current.length > 0 ? current[0][1] : undefined;
};

export const setAt = <TValue>(
    entry: RecursiveEntry<TValue>[],
    path: number[],
    value: TValue
): RecursiveEntry<TValue>[] => {
    const result = [...entry];
    let current: RecursiveEntry<TValue>[] = result;

    for (let i = 0; i < path.length; i++) {
        const index = path[i];
        if (index >= current.length || index < 2) {
            throw new Error(`Path index ${index} does not exist at level ${i}`);
        }
        const item = current[index];
        
        if (i === path.length - 1) {
            item[1] = value;
        } else {
            if (item.length <= 2) item.push(...[] as RecursiveEntry<TValue>[]);
            current = item.slice(2) as RecursiveEntry<TValue>[];
        }
    }
    return result;
};
