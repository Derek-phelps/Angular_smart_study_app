export interface ObjectMap<T> {
    [key: string]: T;
}

export function map2array<TInput, TValue>(
    map: ObjectMap<TInput>,
    valueSelector: (k: string, v: TInput) => TValue = ((k: string, t: TInput) => t as any as TValue)
): TValue[] {

    return Object.keys(map).map(key => valueSelector(key, map[key]));
}

export function array2map<T, TValue>(
    array: T[],
    keySelector: (item: T) => string,
    valueSelector: (item: T) => TValue = ((t: T) => t as any as TValue)
): ObjectMap<TValue> {
    return array.reduce((result, item) => {
        result[keySelector(item)] = valueSelector(item);
        return result;
    }, {} as ObjectMap<TValue>);
}