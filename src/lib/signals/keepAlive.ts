import { Defer, DeferLike, MinimalSignal } from "../mod";
import { Signal } from "./readable";

/**
 * Ensures a signal is kept alive even if it has no subscribers, until
 * this action is canceled by the provided abort signal.
 */
export const KeepAliveSignal = <T>(
	signal: MinimalSignal<T>,
	unsub: DeferLike,
) => {
	const defer = Defer.from(unsub);
	defer(signal.subscribe(() => {}));
	return Signal.fromMinimal(signal);
};
