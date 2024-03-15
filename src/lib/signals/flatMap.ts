import { MappedSignal } from "./map.ts";
import { FlatSignal } from "./flat.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal, SubscriberParams } from "./types.ts";

export const FlatMappedSignal = <S, T>(
	signal: MinimalSignal<S>,
	fn: (value: S, params: SubscriberParams<S>) => T | MinimalSignal<T>,
): Signal<T> => {
	return FlatSignal(MappedSignal(signal, fn)) as Signal<T>;
};
