import type {
	Updater,
	WriteonlySignal,
	MinimalSubscriber,
	Invalidator,
	MinimalWritableSignal,
	StartStop,
} from "./types.ts";
import { Signal } from "./readable.ts";
import { MappedSetterSignal } from "./mappedSetter.ts";
import { SetterSideEffectSignal } from "./setterSideEffect.ts";

export interface WritableSignal<T>
	extends Signal<T>,
		Omit<MinimalWritableSignal<T>, "get" | "subscribe"> {
	update(fn: Updater<T>): void;
	toReadonly(): Signal<T>;
	toWriteonly(): WriteonlySignal<T>;

	/**
	 * **FOOTGUN WARNING:** You probably don't need this function. It is
	 * only useful if you're defining your own custom reactive primitives.
	 * Use it only if you understand exactly what it does.
	 *
	 * Invalidates all dependencies of this signal (ie. signals that are
	 * derived from this one). Invalidating the signal once any of your
	 * dependencies become invalid prevents glitching. The signal will
	 * become valid once its `set` method is called.
	 */
	invalidate(): void;

	/**
	 * Creates a new WritableSignal whose `set` and `update` methods
	 * are mapped using the provided callback `fn`. Use this functionality
	 * to normalize the input or throw an error on invalid state.
	 *
	 * **FOOTGUN WARNING**: Only ever use this method to transform
	 * the input into a logically equivalent form, or to reject invalid
	 * input. If you wanted to use it for more general two-way data
	 * binding, consider using an ordinary mapped readable signal
	 * together with an imperative function (eg. _foo_ & _setFooState_).
	 * That way there'd only be a single source of truth, which is always
	 * preferable.
	 */
	withMappedSetter(fn: (value: T) => T): WritableSignal<T>;

	/**
	 * Creates a new WritableSignal whose `set` and `update` call
	 * the provided function after successfully running. This is
	 * different from adding a subscriber to the original signal,
	 * because this way you can keep both the side-effect-free and
	 * side-effect-full signal, for example keeping one for internal
	 * bookkeeping, and returning the other one as a part of a public
	 * API.
	 */
	withSetterSideEffect(
		fn: (value: T, params: { oldValue: T | undefined }) => T,
	): WritableSignal<T>;
}

export interface WritableSignalOptions extends StartStop {
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

	const invalidate = () => {
		invs.forEach((i) => i());
	};

	return WritableSignal.fromSetAndInvalidateAndSubscribeAndGet({
		set,
		invalidate,
		subscribe,
		get,
	});
};

export const WritableSignal = Object.assign(mut, {
	fromSetAndInvalidateAndSubscribeAndGet<T>({
		set,
		invalidate,
		subscribe,
		get,
	}: Pick<
		WritableSignal<T>,
		"set" | "subscribe" | "get" | "invalidate"
	>): WritableSignal<T> {
		const update = (fn: Updater<T>) => set(fn(get()));

		const toWriteonly = (): WriteonlySignal<T> => ({ set });
		const toReadonly = () =>
			Signal.fromSubscribeAndGet({ subscribe, get });

		const withMappedSetter = (fn: (value: T) => T) =>
			MappedSetterSignal({ set, subscribe, get, invalidate }, fn);

		const withSetterSideEffect = (
			fn: (value: T, params: { oldValue: T | undefined }) => T,
		) =>
			SetterSideEffectSignal({ set, subscribe, get, invalidate }, fn);

		return {
			...Signal.fromSubscribeAndGet({ subscribe, get }),
			set,
			update,
			invalidate,
			toReadonly,
			toWriteonly,
			withMappedSetter,
			withSetterSideEffect,
		};
	},

	fromMinimal<T>(
		signal: MinimalWritableSignal<T>,
	): WritableSignal<T> {
		const { set, invalidate } = signal;
		const { subscribe, get } = Signal.fromMinimal(signal);
		return WritableSignal.fromSetAndInvalidateAndSubscribeAndGet({
			set,
			subscribe,
			get,
			invalidate: invalidate ?? (() => {}),
		});
	},
});
