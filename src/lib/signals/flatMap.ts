import { MappedSignal } from "./map.ts";
import { FlatSignal } from "./flat.ts";
import type { MinimalSignal, Signal } from "./types.ts";

export const FlatMappedSignal = <S, T>(
	signal: MinimalSignal<S>,
	fn: (value: S) => T | MinimalSignal<T>,
): Signal<T> => {
	return FlatSignal(MappedSignal(signal, fn)) as Signal<T>;
};
