import type {
	Subscriber,
	Updater,
	WritableSignal as WritableSignal_,
} from "./types";
import { Signal } from "./readable";

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

	const toReadonly = () => Signal.fromMinimal({ subscribe, get });

	return {
		...Signal.fromMinimal({ subscribe, get }),
		set,
		update,
		toReadonly,
	};
};

/**
 * a shorthand for WritableSignal
 */
export const mut = WritableSignal;
