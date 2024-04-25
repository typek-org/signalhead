import { FilteredSignal } from "./filter.ts";
import { MinimalSignal, SubscriberParams } from "./types.ts";

/**
 * Given a signal and a filtering function, produces a new signal
 * that updates if the source signal updates and the callback returns
 * `false` for the new value.
 */
export const SkippedSignal: typeof FilteredSignal = <T>(
	signal: MinimalSignal<T>,
	fn: (value: T, params: SubscriberParams<T>) => boolean,
	initialValue?: T,
) => {
	return FilteredSignal<T>(
		signal,
		(...args) => !fn(...args),
		initialValue!,
	);
};
