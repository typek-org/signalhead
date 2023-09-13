import { range } from "../utils/collections.ts";
import { Signal } from "./readable.ts";
import {
	Invalidator,
	SignalArrayValues,
	type MinimalSignal,
	type MinimalSubscriber,
	type Unsubscriber,
} from "./types.ts";

export const ZippedSignal: {
	<S, T>(a: MinimalSignal<S>, b: MinimalSignal<T>): Signal<[S, T]>;
	<S, T, U>(
		a: MinimalSignal<S>,
		b: MinimalSignal<T>,
		c: MinimalSignal<U>,
	): Signal<[S, T, U]>;
	<S extends MinimalSignal<any>[]>(
		...signals: S
	): Signal<SignalArrayValues<S>>;
} = (...signals: MinimalSignal<any>[]): Signal<any> => {
	const subs = new Set<MinimalSubscriber<any[]>>();
	const invs = new Set<Invalidator>();

	const dirty: boolean[] = [];
	const unsubs: Unsubscriber[] = [];
	const values: any[] = [];

	const start = () => {
		for (const i of range(signals.length)) {
			unsubs[i] = signals[i].subscribe(
				(v) => {
					values[i] = v;
					dirty[i] = false;
					if (dirty.every((d) => !d)) {
						subs.forEach((s) => s([...values]));
					}
				},
				() => {
					dirty[i] = true;
					invs.forEach((i) => i());
				},
			);
		}
	};
	const stop = () => {
		unsubs.forEach((u) => u());
		unsubs.length = 0;
		dirty.length = 0;
	};

	const subscribe = (
		s: MinimalSubscriber<any[]>,
		i?: Invalidator,
	) => {
		if (subs.size === 0) start();

		subs.add(s);
		if (i) invs.add(i);

		s([...values]);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
			if (subs.size === 0) stop();
		};
	};

	const get = () => {
		if (subs.size === 0) {
			for (const i of range(signals.length)) {
				if (signals[i].get) values[i] = signals[i].get!();
				else signals[i].subscribe((v) => (values[i] = v))();
			}
		}
		return [...values];
	};

	return Signal.fromMinimal({ subscribe, get });
};
