import type { MinimalWritableSignal } from "./types.ts";
import { WritableSignal } from "./writable.ts";

export const MappedSetterSignal = <T>(
	signal: MinimalWritableSignal<T>,
	fn: (value: T) => T,
): WritableSignal<T> => {
	const set = (value: T) => signal.set(fn(value));

	return WritableSignal.fromMinimal({
		...signal,
		set,
	});
};
