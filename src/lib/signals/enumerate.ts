import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

export const EnumeratedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<[number, T]> => {
	let index = 0;
	return MappedSignal(signal, ($val) => [index++, $val]);
};
