import { SkippedSignal } from "./skip.ts";
import { MinimalSignal } from "./types.ts";

export const SignalWithSkippedEqual = <T>(
	signal: MinimalSignal<T>,
) => {
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
