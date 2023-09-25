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

export interface WritableSignalOptions {
	/**
	 * Called when a subscriber is added to a previously subscriber-less signal.
	 */
	onStart?(props: { defer: (destructor: () => void) => void }): void;

	/**
	 * Called when all subscribers unsubscribe.
	 */
	onStop?(): void;

	/**
	 * If set, a warning will be displayed when attempting
	 * to call signal.get() on a signal that currently has
	 * no subscribers.
	 */
	warnOnGetWithoutSubscribers?: string;
}

/**
 * a shorthand for WritableSignal
 */
export const mut: {
	<T>(
		initialValue: T,
		opts?: WritableSignalOptions,
	): WritableSignal<T>;
	<T>(): WritableSignal<T | undefined>;
} = <T>(
	initialValue?: T,
	{
		onStart,
		onStop,
		warnOnGetWithoutSubscribers,
	}: WritableSignalOptions = {},
) => {
	let value: T = initialValue!;

	const subs = new Set<MinimalSubscriber<T>>();
	const invs = new Set<Invalidator>();
	const defered: Array<() => void> = [];
	const defer = (d: () => void) => void defered.push(d);

	const get = () => {
		if (subs.size === 0) {
			if (warnOnGetWithoutSubscribers) {
				console.warn(warnOnGetWithoutSubscribers);
			}
			onStart?.({ defer });
			for (const d of defered) d();
			defered.length = 0;
			onStop?.();
		}

		return value;
	};

	const minSubscribe = (s: MinimalSubscriber<T>, i?: Invalidator) => {
		if (subs.size === 0) onStart?.({ defer });
		subs.add(s);
		if (i) invs.add(i);

		s(value);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);

			if (subs.size === 0) {
				for (const d of defered) d();
				defered.length = 0;
				onStop?.();
			}
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
