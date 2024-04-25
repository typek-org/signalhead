import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

/**
 * Takes a signal and produces a new signal containing the original
 * value accompanied by a number which increases by one every time
 * the source signal updates.
 *
 * **FOOTGUN WARNING**: Because of the lazy nature of signals,
 * the index will be incorrect if this signal loses all
 * subscribers. To ensure the correct result regardless of the
 * subscriber count, use as `s.enumerate().keepAlive(d)` with a
 * suitable abort controller.
 *
 * @see {Signal#keepAlive}
 */
export const EnumeratedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<[number, T]> => {
	let index = 0;
	return MappedSignal(signal, ($val) => [index++, $val]);
};
