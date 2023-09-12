import {
	type Updater,
	type WritableSignal as WritableSignal_,
	type WriteonlySignal,
	type MinimalSubscriber,
} from "./types.ts";
import { Signal } from "./readable.ts";

export type WritableSignal<T> = WritableSignal_<T>;

export const WritableSignal: {
	<T>(initialValue: T): WritableSignal<T>;
	<T>(): WritableSignal<T | undefined>;
} = <T>(initialValue?: T): WritableSignal<T> => {
	let value: T = initialValue!;
	const get = () => value;

	const subs = new Set<MinimalSubscriber<T>>();
	const minSubscribe = (s: MinimalSubscriber<T>) => {
		subs.add(s);
		s(value);
		return () => subs.delete(s);
	};
	const { subscribe } = Signal.fromMinimal({
		subscribe: minSubscribe,
		get,
	});

	const set = (v: T) => {
		value = v;
		subs.forEach((s) => s(value));
	};
	const update = (fn: Updater<T>) => set(fn(value));

	const toReadonly = () =>
		Signal.fromSubscribeAndGet({ subscribe, get });
	const toWriteonly = (): WriteonlySignal<T> => ({ set });

	return {
		...Signal.fromSubscribeAndGet({ subscribe, get }),
		set,
		update,
		toReadonly,
		toWriteonly,
	};
};

/**
 * a shorthand for WritableSignal
 */
export const mut = WritableSignal;
