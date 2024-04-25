import { MappedSignal } from "./map.ts";
import type { Signal } from "./readable.ts";
import type { MinimalSignal, SubscriberParams } from "./types.ts";

export interface TappedSignalOptions {
	/**
	 * If set to `true`, will ensure that all updates are logged, as opposed
	 * to the default lazy behavior that only logs if the signal has a subscriber.
	 *
	 * **FOOTGUN WARNING**: There is no way to unsubscribe this, so use it
	 * only for debugging or signals with a static lifetime. Otherwise use
	 * `signal.keepAlive(d)` with an abort signal.
	 */
	keepAlive?: boolean;
}

/**
 * Provided a callback, returns a new signal that will call the callback on
 * every update. Since signals are lazy, **no update will actually happen** unless
 * somebody actually subscribes to the signal. This is super useful for debugging
 * the actual movement of values in your data pipelines. If you want to log every
 * update regardless whether somebody is subscribed, use either
 * `s.subscribe(x => console.log(x))`, or `s.tap(x => console.log(x), { keepAlive: true })`.
 *
 * @example
 * const greeting = mut("Hello");
 * const name = mut("John");
 * const message =
 *   greeting
 *     .zip(name)
 *     .map(([greet, name]) => `${greet}, ${name}!`)
 *     .tap(s => console.log(s));
 * // doesn't log anything right away
 *
 * name.set('Joe');
 * // still doesn't log anything, because message has no subscribers
 *
 * message.get(); // logs "Hello, Joe"
 * message.subscribe(() => {}); // logs "Hello, Joe"
 * greeting.set("Greetings") // logs "Greetings, Joe"
 *
 * @see {Signal#tap}
 */
export const TappedSignal = <T>(
	signal: MinimalSignal<T>,
	listener: (value: T, params: SubscriberParams<T>) => void,
	{ keepAlive }: TappedSignalOptions = {},
): Signal<T> => {
	const result = MappedSignal(signal, (value, params) => {
		listener(value, params);
		return value;
	});

	if (keepAlive) result.subscribe(() => {});
	return result;
};
