import { Signal } from "./readable.ts";
import type { MinimalSignal, Subscriber } from "./types.ts";

export const MappedSignal = <S, T>(
	signal: MinimalSignal<S>,
	fn: (value: S) => T,
): Signal<T> => {
	const subs = new Set<Subscriber<T>>();
	let unsub = () => {};
	let value: T;

	const start = () => {
		unsub = signal.subscribe((v) => {
			value = fn(v);
			subs.forEach((s) => s(value));
		});
	};
	const stop = () => {
		unsub();
		unsub = () => {};
	};

	const subscribe = (fn: Subscriber<T>) => {
		if (subs.size === 0) start();

		subs.add(fn);
		fn(value);

		return () => {
			subs.delete(fn);
			if (subs.size === 0) stop();
		};
	};

	const get = () => {
		if (subs.size === 0) {
			if (signal.get) return fn(signal.get()!);
			start();
			stop();
		}
		return value;
	};

	return Signal.fromMinimal({ subscribe, get });
};
