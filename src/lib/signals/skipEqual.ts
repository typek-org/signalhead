import { SkippedSignal } from "./skip";
import { MinimalSignal } from "./types";

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
