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
} = function <T, U>(
	signal: MinimalSignal<T>,
	fn: (previousValue: U, currentValue: T) => U,
	initialValue?: U,
): Signal<U> {
	let initialValueSet = arguments.length === 3;
	let value = initialValue as U;

	const callback = (newValue: T): U => {
		if (!initialValueSet) {
			initialValueSet = true;
			value = newValue as any;
		} else {
			value = fn(value, newValue);
		}
		return value;
	};

	return MappedSignal(signal, callback);
};
