import { cons } from "./cons.ts";
import { Signal } from "./readable.ts";
import type {
	Invalidator,
	MinimalSignal,
	MinimalSubscriber,
	Unsubscriber,
} from "./types.ts";

export type FlatSignal<Signal, Depth extends number> = {
	done: Signal;
	recur: Signal extends MinimalSignal<infer InnerSignal>
		? FlatSignal<
				InnerSignal,
				// prettier-ignore
				[ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ][Depth]
		  >
		: Signal;
}[Depth extends -1 ? "done" : "recur"];

export const FlatSignal: <S, D extends number = 1>(
	signal: S,
	depth?: D,
) => Signal<FlatSignal<S, D>> = (
	signal: unknown,
	depth?: number,
): any => {
	depth ??= 1;

	if (!Signal.isReadable(signal)) return cons(signal);

	if (depth <= 0) {
		return Signal.fromMinimal(signal);
	}

	if (depth === 1) {
		return ShallowFlatSignal(signal);
	}

	return FlatSignal(ShallowFlatSignal(signal), depth - 1);
};

const ShallowFlatSignal = <T>(
	signal: MinimalSignal<MinimalSignal<T> | T>,
): Signal<T> => {
	let value: T;
	let unsubOuter = () => {};
	let unsubInner = () => {};

	const subs = new Set<MinimalSubscriber<T>>();
	const invs = new Set<Invalidator>();

	const set = (v: T) => {
		value = v;
		subs.forEach((s) => s(value));
	};
	const invalidate = () => {
		invs.forEach((i) => i());
	};

	const start = () => {
		unsubOuter = signal.subscribe((v) => {
			unsubInner();
			if (Signal.isReadable(v)) {
				unsubInner = v.subscribe((w) => {
					set(w);
				}, invalidate);
			} else {
				unsubInner = () => {};
				set(v);
			}
		}, invalidate);
	};

	const stop = () => {
		unsubOuter();
		unsubOuter = () => {};
	};

	const subscribe = (
		s: MinimalSubscriber<T>,
		i?: Invalidator,
	): Unsubscriber => {
		if (subs.size === 0) start();
		subs.add(s);
		if (i) invs.add(i);
		s(value);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
			if (subs.size === 0) stop();
		};
	};

	const get = (): T | undefined => {
		if (subs.size === 0) {
			let v = Signal.get(signal);
			if (Signal.isReadable(v)) {
				v = Signal.get(v);
			}
			value = v!;
		}
		return value;
	};

	return Signal.fromMinimal({ subscribe, get });
};
