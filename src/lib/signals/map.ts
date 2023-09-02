import { MinimalSignal, Signal, Subscriber } from "./types.ts";

export const mappedSignal = <S, T>(
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
			start();
			stop();
		}
		return value;
	};

	const map = <S>(fn: (value: T) => S) =>
		mappedSignal({ subscribe }, fn);

	return { subscribe, get, map };
};
