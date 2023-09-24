import { effect } from "./effect.ts";
import {
	mut,
	type MinimalSignal,
	type Signal,
} from "../signals/mod.ts";

export interface DerivedParams {
	defer(destructor: () => void): void;
}

/**
 * A convenient way to make a new signal whose value is computed
 * form the values of multiple different signals.
 * @see effect
 * @example
 * const num1 = mut(10);
 * const num2 = mut(8);
 * const gcd = derived($ => {
 *   let [a, b] = [$(num1), $(num2)];
 *   while (b !== 0) [a, b] = [b, a % b];
 *   return a;
 * });
 * // gcd = 2
 *
 * num1.set(12);
 * // gcd = 4
 */
export function derived<T>(
	f: ($: <U>(s: MinimalSignal<U>) => U, params: DerivedParams) => T,
): Signal<T> {
	const signal = mut<T>(undefined!, {
		onStart({ defer }) {
			defer(effect(($, params) => signal.set(f($, params))));
		},
	});

	return signal.toReadonly();
}
