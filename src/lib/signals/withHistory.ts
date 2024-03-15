import { Signal } from "./readable.ts";
import { mut } from "./writable.ts";
import type { MinimalSignal, TupleOf } from "./types.ts";

export type SignalWithHistory<T, N extends number> = Signal<
	TupleOf<T, N>
>;

/**
 * Takes a signal, and produces a new signal which collects the last
 * few values of the former one into an array. The most current value
 * is always in the first one in the array, the previous value is second,
 * etc. It is similar to the NPM package `svelte-previous` or to Rust's
 * `slice::windows` method.
 *
 * As all signals are lazy, SignalWithHistory will not subscribe to
 * it's dependency immediately, but only once it has any subscribers
 * itself – and will unsubscribe from its dependency once all its
 * subscribers unsubscribe. This means that historic values are not
 * tracked while there are no subscribers – if you need them, add a
 * dummy subscriber. (Don't forget to unsubscribe it eventually.)
 *
 * @example
 * const a = mut(42);
 * const b = a.withHistory(3);
 *
 * a.set(69);
 * b.subscribe(console.log); // [69, 69, 69]
 * // the history was not tracked while there were no subscribers
 *
 * a.set(-12); // b: [-12, 69, 69]
 * a.set(420); // b: [420, -12, 69]
 * a.set(3); // b: [3, 420, -12]
 */
export const SignalWithHistory = <T, N extends number = 2>(
	signal: MinimalSignal<T>,
	howMany: N,
): SignalWithHistory<T, N> => {
	if (howMany <= 0) {
		throw new RangeError(
			"Cannot create a signal with history of less than one.",
		);
	}

	let values: T[] = [];
	const signalWithHistory = mut<TupleOf<T, N>>(undefined!, {
		warnOnGetWithoutSubscribers:
			"Attempting to get the value of a SignalWithHistory which does not have " +
			"any subscribers. SignalWithHistory will *not* track the history of the " +
			"underlying signal unless it has a subscriber; instead it will return " +
			"an array filled with the current value.",

		onStart({ defer }) {
			// fill `values` with the current value in order to signal
			// that no historical value but the current value is known
			const curr = Signal.get(signal);
			values = Array.from({ length: howMany }).fill(curr) as any;

			// subscribe to further changes
			defer(
				signal.subscribe((v) => {
					values.unshift(v);
					values.pop();
					signalWithHistory.set([...values] as TupleOf<T, N>);
				}),
			);
		},
	});

	return signalWithHistory.toReadonly();
};
