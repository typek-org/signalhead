import { MappedSignal } from "./map.ts";
import type { MinimalSignal, Signal } from "./types.ts";

export const SideEffectSignal = <T>(
	signal: MinimalSignal<T>,
	listener: (value: T) => void,
	{ keepAlive }: { keepAlive?: boolean } = {},
): Signal<T> => {
	const result = MappedSignal(signal, (value) => {
		listener(value);
		return value;
	});

	if (keepAlive) result.subscribe(() => {});
	return result;
};
