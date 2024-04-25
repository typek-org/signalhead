import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal } from "./types.ts";

/**
 * Takes a signal and produces a new signal containing a number
 * which increases by one every time the source signal updates.
 *
 * **FOOTGUN WARNING**: Because of the lazy nature of signals,
 * the value of this signal will be incorrect if it loses all
 * subscribers. To ensure the correct result regardless of the
 * subscriber count, use as `s.count().keepAlive(d)` with a
 * suitable abort controller.
 *
 * @see {Signal#keepAlive}
 */
export const CountedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<number> => {
	let index = 0;
	return MappedSignal(signal, (_) => index++);
};
