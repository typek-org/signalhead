import type { Signal, MinimalSignal } from "./mod.ts";
import { SkippedSignal } from "./skip.ts";

/**
 * Produces a new signal whose value only updates if it
 * is not strictly equal to the old value.
 */
export const SignalWithSkippedEqual = <T>(
	signal: MinimalSignal<T>,
): Signal<T> => {
	return SkippedSignal(
		signal,
		(value, { prev, isFirstRun }) => {
			if (isFirstRun) return false;
			return value === prev;
		},
		// we guarantee that the first run always passes
		undefined!,
	);
};
