import { Signal } from "./readable.ts";
import type { MinimalWritableSignal } from "./types.ts";
import { WritableSignal } from "./writable.ts";

export const SetterSideEffectSignal = <T>(
	signal: MinimalWritableSignal<T>,
	fn: (value: T, params: { oldValue: T | undefined }) => T,
): WritableSignal<T> => {
	const { set, subscribe, get } = signal;
	const newSet = (value: T) => {
		const oldValue = Signal.get(signal);
		set(value);
		fn(value, { oldValue });
	};

	return WritableSignal.fromMinimal({
		set: newSet,
		subscribe,
		get,
	});
};
