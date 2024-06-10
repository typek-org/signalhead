import { effect } from "./effect.ts";
import type { DerivedParams } from "./derived.ts";
import {
	mut,
	type MinimalSignal,
	type WritableSignal,
} from "../signals/mod.ts";

/**
 * Sometimes you need a writable signal whose value automatically
 * changes under some conditions, depending on some external signals.
 *
 * A prototypical example would be the situation where you have a
 * stateful UI element which the user can change, however the state
 * has to be valid under some schema. Once the schema changes, you
 * want to automatically and immediately reset the element's state
 * so that it's valid and doesn't cause glitching.
 *
 * This function behaves exactly like `derived`, but returns a
 * writable signal. Setting the signal's value does **not** cause
 * the callback to be re-run. The `prev` param will always reflect
 * the signal's current value, regardless of whether it was set
 * by the callback or by a call to the `set` method.
 * @see derived
 * @example
 * const validator = mut({
 *   default: 2,
 *   isValid: (x: number) => x % 2 === 0
 * });
 *
 * const current = mutDerived(($, { prev }) => {
 *   const { default, isValid } = $(validator);
 *
 *   if (isValid(prev)) {
 *     return prev;
 *   } else {
 *     return default;
 *   }
 * });
 */
export function mutDerived<T>(
	f: (
		$: <U>(s: MinimalSignal<U>) => U,
		params: DerivedParams<T>,
	) => T,
): WritableSignal<T> {
	let value: T | undefined;
	const signal = mut<T>(undefined!, {
		onStart({ defer }) {
			effect(
				($, params) => {
					value = f($, { ...params, prev: value });
					signal.set(value);
				},
				() => signal.invalidate(),
				() => signal.validate(),
			).pipe(defer);
		},
	});

	return signal.withSetterSideEffect((newValue: T) => {
		value = newValue;
		return newValue;
	});
}
