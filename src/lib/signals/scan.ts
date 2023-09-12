import { MappedSignal } from "./map.ts";
import type { MinimalSignal, Signal } from "./types.ts";

export const ScannedSignal: {
	<T>(
		signal: MinimalSignal<T>,
		fn: (previousValue: T, currentValue: T) => T,
	): Signal<T>;
	<T>(
		signal: MinimalSignal<T>,
		fn: (previousValue: T, currentValue: T) => T,
		initialValue: T,
	): Signal<T>;
	<T, U>(
		signal: MinimalSignal<T>,
		fn: (previousValue: U, currentValue: T) => U,
		initialValue: U,
	): Signal<U>;
} = <T, U>(
	signal: MinimalSignal<T>,
	fn: (previousValue: U, currentValue: T) => U,
	initialValue?: U,
): Signal<U> => {
	let value = initialValue;
	return MappedSignal(
		signal,
		(newValue) => (value = fn(value!, newValue)),
	);
};
