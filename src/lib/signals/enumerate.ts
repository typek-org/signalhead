import { MappedSignal } from ".";
import type { MinimalSignal, Signal } from "./types.ts";

export const EnumeratedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<[number, T]> => {
	let index = 0;
	return MappedSignal(signal, ($val) => [index++, $val]);
};
