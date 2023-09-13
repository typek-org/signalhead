import type {
	Updater,
	WritableSignal as WritableSignal_,
	WriteonlySignal,
	MinimalSubscriber,
	Invalidator,
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
	const invs = new Set<Invalidator>();
	const minSubscribe = (s: MinimalSubscriber<T>, i?: Invalidator) => {
		subs.add(s);
		if (i) invs.add(i);

		s(value);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
		};
	};
	const { subscribe } = Signal.fromMinimal({
		subscribe: minSubscribe,
		get,
	});

	const set = (v: T) => {
		value = v;
		invs.forEach((i) => i());
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
