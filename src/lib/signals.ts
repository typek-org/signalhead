import type {
	MinimalSignal,
	Signal,
	Subscriber,
	Updater,
	WritableSignal,
} from "./types";

export const writableSignal: {
	<T>(initialValue: T): WritableSignal<T>;
	<T>(): WritableSignal<T | undefined>;
} = <T>(initialValue?: T): WritableSignal<T> => {
	let value: T = initialValue!;
	const subs = new Set<Subscriber<T>>();

	const get = () => value;
	const set = (v: T) => {
		value = v;
		subs.forEach((s) => s(value));
	};
	const update = (fn: Updater<T>) => set(fn(value));

	const subscribe = (fn: Subscriber<T>) => {
		subs.add(fn);
		fn(value);
		return () => subs.delete(fn);
	};

	const map = <S>(fn: (value: T) => S) =>
		mappedSignal({ subscribe }, fn);

	const toReadonly = () => ({ subscribe, get, map });

	return { subscribe, get, set, update, map, toReadonly };
};

const mappedSignal = <S, T>(
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

export const cons = <T>(value: T) =>
	writableSignal(value).toReadonly();
