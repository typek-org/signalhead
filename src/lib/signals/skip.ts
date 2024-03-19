import { FilteredSignal } from "./filter.ts";
import { MinimalSignal, SubscriberParams } from "./types.ts";

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
