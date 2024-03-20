import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal, SubscriberParams } from "./types.ts";

export const TappedSignal = <T>(
	signal: MinimalSignal<T>,
	listener: (value: T, params: SubscriberParams<T>) => void,
	{ keepAlive }: { keepAlive?: boolean } = {},
): Signal<T> => {
	const result = MappedSignal(signal, (value, params) => {
		listener(value, params);
		return value;
	});

	if (keepAlive) result.subscribe(() => {});
	return result;
};
