import type { Signal } from "./readable.ts";
import { mut } from "./writable.ts";

/**
 * a constant signal that will never change
 */
export const cons = <T>(value: T): Signal<T> =>
	mut(value).toReadonly();
