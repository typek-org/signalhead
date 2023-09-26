import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

export const CountedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<number> => {
	let index = 0;
	return MappedSignal(signal, (_) => index++);
};
