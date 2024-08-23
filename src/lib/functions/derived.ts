import { mutDerived } from "./mutDerived.ts";
import type { MinimalSignal, Signal } from "../signals/mod.ts";
import type { Defer } from "../utils/defer.ts";

export interface DerivedParams<T> {
	defer: Defer;
	prev: T | undefined;
}

/**
 * A convenient way to make a new signal whose value is computed
 * form the values of multiple different signals.
 * @see effect
 * @example
 * ```ts
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
 * ```
 */
export function derived<T>(
	f: (
		$: <U>(s: MinimalSignal<U>) => U,
		params: DerivedParams<T>,
	) => T,
): Signal<T> {
	return mutDerived(f).toReadonly();
}
