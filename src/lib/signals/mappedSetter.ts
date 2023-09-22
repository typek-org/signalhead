import type { MinimalWritableSignal } from "./types.js";
import { WritableSignal } from "./writable.js";

export const MappedSetterSignal = <T>(
	signal: MinimalWritableSignal<T>,
	fn: (value: T) => T,
): WritableSignal<T> => {
	const { set, subscribe, get } = signal;
	const mappedSet = (value: T) => set(fn(value));

	return WritableSignal.fromMinimal({
		set: mappedSet,
		subscribe,
		get,
	});
};
