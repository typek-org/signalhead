import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

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
