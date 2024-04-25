import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

/**
 * Given a signal and an aggregator function, produces a new
 * signal whose value will be computed from the source signal's
 * new value and this signal's previous value.
 *
 * As all signals are lazy, a scanned signal will not track its
 * source until it has a subscriber. If you want to avoid loosing
 * values, use `s.scan(...).keepAlive(d)` with a proper abort signal.
 *
 * @see {Signal#keepAlive}
 */
export const ScannedSignal: {
	<T>(
		signal: MinimalSignal<T>,
		fn: (previousValue: T, currentValue: T) => T,
	): Signal<T>;
	<T>(
		signal: MinimalSignal<T>,
		fn: (previousValue: T, currentValue: T) => T,
		initialValue: T,
	): Signal<T>;
	<T, U>(
		signal: MinimalSignal<T>,
		fn: (previousValue: U, currentValue: T) => U,
		initialValue: U,
	): Signal<U>;
} = function <T, U>(
	signal: MinimalSignal<T>,
	fn: (previousValue: U, currentValue: T) => U,
	initialValue?: U,
): Signal<U> {
	let initialValueSet = arguments.length === 3;
	let value = initialValue as U;

	const callback = (newValue: T): U => {
		if (!initialValueSet) {
			initialValueSet = true;
			value = newValue as any;
		} else {
			value = fn(value, newValue);
		}
		return value;
	};

	return MappedSignal(signal, callback);
};
