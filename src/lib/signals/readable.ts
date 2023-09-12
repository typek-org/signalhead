import { MapSet } from "../utils/collections.ts";
import { CountedSignal } from "./count.ts";
import { EnumeratedSignal } from "./enumerate.ts";
import { MappedSignal } from "./map.ts";
import { ScannedSignal } from "./scan.ts";
import {
	Subscriber,
	type MinimalSignal,
	type Signal as Signal_,
	Unsubscriber,
} from "./types.ts";

export type Signal<T> = Signal_<T>;
export const Signal = {
	fromSubscribeAndGet<T>({
		subscribe,
		get,
	}: Pick<Signal<T>, "subscribe" | "get">): Signal<T> {
		const map = <S>(fn: (value: T) => S) =>
			MappedSignal({ subscribe, get }, fn);

		const enumerate = () => EnumeratedSignal({ subscribe, get });
		const count = () => CountedSignal({ subscribe, get });

		const scan = <U>(fn: (prev: U, curr: T) => U, initialValue?: U) =>
			ScannedSignal({ subscribe, get }, fn, initialValue!);

		return { subscribe, get, map, enumerate, count, scan };
	},

	fromMinimal<T>(signal: MinimalSignal<T>): Signal<T> {
		let unsub: Unsubscriber = () => {};
		let value: T | undefined;
		const subs = new Set<Subscriber<T>>();
		const deferred = new MapSet<Subscriber<T>, Unsubscriber>();

		const start = () => {
			unsub = signal.subscribe((val) => {
				for (const d of deferred.flatValues()) d();
				deferred.clear();

				const oldValue = value;
				value = val;

				for (const s of subs) {
					const defer = (d: Unsubscriber) => deferred.add(s, d);
					s(val, { oldValue, defer });
				}
			});
		};
		const stop = () => {
			unsub();
			unsub = () => {};
		};

		const subscribe = (s: Subscriber<T>) => {
			if (subs.size === 0) start();
			subs.add(s);
			const defer = (d: Unsubscriber) => deferred.add(s, d);
			s(value!, { oldValue: value, defer });

			return () => {
				subs.delete(s);
				for (const d of deferred.get(s) ?? []) d();
				deferred.delete(s);
			};
		};

		const get = (): T => {
			if (subs.size === 0) {
				if (signal.get) return signal.get()!;
				start();
				stop();
			}
			return value!;
		};

		return Signal.fromSubscribeAndGet({ subscribe, get });
	},
};
