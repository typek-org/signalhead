import { Signal } from "./readable.ts";
import {
	Validator,
	type Invalidator,
	type MinimalSignal,
	type MinimalSubscriber,
} from "./types.ts";

export const MappedSignal = <S, T>(
	signal: MinimalSignal<S>,
	fn: (value: S) => T,
): Signal<T> => {
	const subs = new Set<MinimalSubscriber<T>>();
	const invs = new Set<Invalidator>();
	const vals = new Set<Validator>();
	let unsub = () => {};
	let value: T;

	const start = () => {
		unsub = signal.subscribe(
			(v) => {
				value = fn(v);
				subs.forEach((s) => s(value));
			},
			() => invs.forEach((i) => i()),
			() => vals.forEach((v) => v()),
		);
	};
	const stop = () => {
		unsub();
		unsub = () => {};
	};

	const subscribe = (
		s: MinimalSubscriber<T>,
		i?: Invalidator,
		v?: Validator,
	) => {
		if (subs.size === 0) start();

		subs.add(s);
		if (i) invs.add(i);
		if (v) vals.add(v);

		s(value);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
			if (v) vals.delete(v);
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
