import { mappedSignal } from "./map";
import type {
	Subscriber,
	Updater,
	WritableSignal as WritableSignal_,
} from "./types";

export type WritableSignal<T> = WritableSignal_<T>;

export const WritableSignal: {
	<T>(initialValue: T): WritableSignal<T>;
	<T>(): WritableSignal<T | undefined>;
} = <T>(initialValue?: T): WritableSignal<T> => {
	let value: T = initialValue!;
	const subs = new Set<Subscriber<T>>();

	const get = () => value;
	const set = (v: T) => {
		value = v;
		subs.forEach((s) => s(value));
	};
	const update = (fn: Updater<T>) => set(fn(value));

	const subscribe = (fn: Subscriber<T>) => {
		subs.add(fn);
		fn(value);
		return () => subs.delete(fn);
	};

	const map = <S>(fn: (value: T) => S) =>
		mappedSignal({ subscribe }, fn);

	const toReadonly = () => ({ subscribe, get, map });

	return { subscribe, get, set, update, map, toReadonly };
};

/**
 * a shorthand for WritableSignal
 */
export const mut = WritableSignal;
