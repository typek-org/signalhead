import { mut } from "./writable.ts";

/**
 * a constant signal that will never change
 */
export const cons = <T>(value: T) => mut(value).toReadonly();
