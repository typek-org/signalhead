import { MappedSignal } from "./map.js";
import type { MinimalSignal, Signal } from "./types.js";

export const TappedSignal = <T>(
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
