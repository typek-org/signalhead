import { range } from "../utils/collections.ts";
import { Signal } from "./readable.ts";
import type {
	Invalidator,
	SignalArrayValues,
	MinimalSignal,
	MinimalSubscriber,
	Unsubscriber,
	Validator,
} from "./types.ts";

/**
 * Given several signals, returns a new signal whose value is a tuple of the source
 * signals' values. Updates every time one of the source signals updates. If multiple
 * signals are updated at once, the zipped signal only updates once.
 */
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
	const vals = new Set<Validator>();

	let changedWhileDirty = false;
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
						changedWhileDirty = false;
						for (const s of [...subs]) s([...values]);
					} else {
						changedWhileDirty = true;
					}
				},
				() => {
					dirty[i] = true;
					invs.forEach((i) => i());
				},
				() => {
					dirty[i] = false;
					if (dirty.every((d) => !d)) {
						if (changedWhileDirty) {
							for (const s of [...subs]) s([...values]);
						} else {
							vals.forEach((v) => v());
						}
						changedWhileDirty = false;
					}
				},
			);
		}
	};
	const stop = () => {
		for (const u of unsubs) u();
		unsubs.length = 0;
		dirty.length = 0;
	};

	const subscribe = (
		s: MinimalSubscriber<any[]>,
		i?: Invalidator,
		v?: Validator,
	) => {
		if (subs.size === 0) start();

		subs.add(s);
		if (i) invs.add(i);
		if (v) vals.add(v);

		s([...values]);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
			if (v) vals.delete(v);
			if (subs.size === 0) stop();
		};
	};

	const get = () => {
		if (subs.size === 0) {
			for (const i of range(signals.length)) {
				values[i] = Signal.get(signals[i]);
			}
		}
		return [...values];
	};

	return Signal.fromMinimal({ subscribe, get });
};
