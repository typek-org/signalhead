import type {
	Updater,
	WritableSignal as WritableSignal_,
	WriteonlySignal,
	MinimalSubscriber,
	Invalidator,
	MinimalWritableSignal,
} from "./types.ts";
import { Signal } from "./readable.ts";
import { MappedSetterSignal } from "./mappedSetter.ts";

export type WritableSignal<T> = WritableSignal_<T>;

/**
 * a shorthand for WritableSignal
 */
export const mut: {
	<T>(initialValue: T): WritableSignal<T>;
	<T>(): WritableSignal<T | undefined>;
} = <T>(initialValue?: T) => {
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

	return WritableSignal.fromSetAndSubscribeAndGet({
		set,
		subscribe,
		get,
	});
};

export const WritableSignal = Object.assign(mut, {
	fromSetAndSubscribeAndGet<T>({
		set,
		subscribe,
		get,
	}: Pick<
		WritableSignal<T>,
		"set" | "subscribe" | "get"
	>): WritableSignal<T> {
		const update = (fn: Updater<T>) => set(fn(get()));

		const toWriteonly = (): WriteonlySignal<T> => ({ set });
		const toReadonly = () =>
			Signal.fromSubscribeAndGet({ subscribe, get });

		const withMappedSetter = (fn: (value: T) => T) =>
			MappedSetterSignal({ set, subscribe, get }, fn);

		return {
			...Signal.fromSubscribeAndGet({ subscribe, get }),
			set,
			update,
			toReadonly,
			toWriteonly,
			withMappedSetter,
		};
	},

	fromMinimal<T>(
		signal: MinimalWritableSignal<T>,
	): WritableSignal<T> {
		const { set } = signal;
		const { subscribe, get } = Signal.fromMinimal(signal);
		return WritableSignal.fromSetAndSubscribeAndGet({
			set,
			subscribe,
			get,
		});
	},
});
