import { isArray } from "lodash";
// import { default as _uuid } from "uuid/v4";
import { v4 as _uuid } from 'uuid';
import { BehaviorSubject, Observable } from "rxjs";




export function getTime(): Date {
    return new Date();
}

export function getMilliseconds(): number {
    return Date.now();
}

export function uuid(): string {
    return _uuid();
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function isValidNumber(n: any): n is number {
    return n !== undefined && typeof n == 'number' && !isNaN(n) && isFinite(n);
}

export function asTwoDigitStr(n: number) {
    return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}

export function delay(delay: number) {
    return new Promise(r => {
        setTimeout(r, delay);
    })
}


export type BehaviorObservable<T> = Observable<T> & {
    readonly value: T;
};

export type BehaviorFactory<T> = () => BehaviorObservable<T>;

export function asBehavior<T>(behaviorSubject: BehaviorSubject<T>): BehaviorObservable<T> {
    return behaviorSubject as BehaviorObservable<T>;
}

export function asObservable<T>(observable: Observable<T>): Observable<T> {
    return observable as Observable<T>;
}


export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}


export function safeStringify(obj: any, indent: any = 2) {
  let cache: any = [];
  const retVal: any = JSON.stringify(
    obj,
    (key: any, value: any) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};



export type TypeGuard<T> = (value: unknown) => value is T;

export function lazy<T>(factory: () => T): () => T {
    let instance: T | undefined;
    return () => {
        if (!instance) {
            instance = factory();
        }
        return instance;
    };
}

export function isBlank(value: string): boolean {
    return value.trim().length === 0;
}

export function toArray<T>(value: T | T[] | undefined): T[] {
    if (isUndefined(value)) return [];
    if (isArray(value)) return value;

    return [value];
}

export function isNil(value: unknown): value is undefined | null {
    return value === null || value === undefined;
}

function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isString(value: unknown): value is string {
    return !isNil(value) && typeof value === "string";
}

isString.toString = () => "string";

export function isStringArray(value: unknown): value is string[] {
    return expectEach(value, isString);
}

isStringArray.toString = () => "string[]";

function expectEach<V>(value: unknown, guard: TypeGuard<V>): value is V[] {
    if (isNil(value) || !isArray(value)) return false;

    for (const v in value) {
        if (value.hasOwnProperty(v) && !guard(v)) return false;
    }

    return true;
}

export function getIn<T, K extends keyof T, V>(object: T, key: K, guard: TypeGuard<V>): V | undefined {
    if (isNil(object)) return undefined;

    const value = object[key];
    if (isUndefined(value)) return undefined;

    return guard(value) ? value : undefined;
}

export function omitIndex<T>(array: T[], index: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        if (i !== index) {
            result.push(array[i]);
        }
    }
    return result;
}

/**
 * Returns the value, or undefined if value is null or undefined.
 */
export function optional<T extends any>(value: T | null | undefined): T | undefined {
    return isNil(value) ? undefined : value;
}

/**
 * Returns the value, or null if value is null or undefined.
 */
export function orNull<T extends any>(value: T | null | undefined): T | null {
    return isNil(value) ? null : value;
}


export function isFunction(f: any) {
    return f !== null && f !== undefined && typeof f === "function";
}

export function cleanNullableProp<T>(value: T | null): T | string {
    if (value === null) {
        return "";
    } else {
        return value;
    }
}

export function swapIndices<T>(array: T[], idx1: number, idx2: number): T[] {
    const arrayCopy = [...array];
    const temp = arrayCopy[idx1];
    arrayCopy[idx1] = arrayCopy[idx2];
    arrayCopy[idx2] = temp;
    return arrayCopy;
}

export function asInteger(value: unknown, defaultValue: number = 0): number {
    if (typeof value === "number") {
        return parseInt(value.toFixed(0), 10);
    }

    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        return !isNaN(parsed) ? parsed : defaultValue;
    }

    return defaultValue;
}

export function clampMinimum(num: number, minimum: number): number {
    return num >= minimum ? num : minimum;
}

// export interface Boxed<T> {
//     value: T | undefined;
// }
//
// export function boxed<T>(value?: T): Boxed<T> {
//     return { value };
// }
