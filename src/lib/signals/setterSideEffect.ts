import { Signal } from "./readable.ts";
import type { MinimalWritableSignal } from "./types.ts";
import { WritableSignal } from "./writable.ts";

export const SetterSideEffectSignal = <T>(
	signal: MinimalWritableSignal<T>,
	fn: (value: T, params: { prev: T | undefined }) => T,
): WritableSignal<T> => {
	const set = (value: T) => {
		const prev = Signal.get(signal);
		signal.set(value);
		fn(value, { prev });
	};

	return WritableSignal.fromMinimal({
		...signal,
		set,
	});
};
