import { MapSet } from "../utils/collections.ts";
import { CountedSignal } from "./count.ts";
import { TappedSignal } from "./tap.ts";
import { EnumeratedSignal } from "./enumerate.ts";
import { FlatSignal } from "./flat.ts";
import { FlatMappedSignal } from "./flatMap.ts";
import { MappedSignal } from "./map.ts";
import { ScannedSignal } from "./scan.ts";
import type {
	Subscriber,
	MinimalSignal,
	Signal as Signal_,
	Unsubscriber,
	Invalidator,
	WriteonlySignal,
} from "./types.ts";
import { ZippedSignal } from "./zip.ts";

export type Signal<T> = Signal_<T>;
export const Signal = {
	get<T>(signal: MinimalSignal<T>): T {
		if (signal.get) return signal.get()!;

		let value!: T;
		signal.subscribe((v) => (value = v))();
		return value;
	},

	fromSubscribeAndGet<T>({
		subscribe,
		get,
	}: Pick<Signal<T>, "subscribe" | "get">): Signal<T> {
		const map = <S>(fn: (value: T) => S) =>
			MappedSignal({ subscribe, get }, fn);

		const enumerate = () => EnumeratedSignal({ subscribe, get });
		const count = () => CountedSignal({ subscribe, get });

		const tap = (
			listener: (value: T) => void,
			options?: { keepAlive?: boolean },
		) => TappedSignal({ subscribe, get }, listener, options);

		const flat = <D extends number>(depth?: D): any =>
			FlatSignal({ subscribe, get }, depth);

		const flatMap = <S>(fn: (value: T) => S | MinimalSignal<S>) =>
			FlatMappedSignal({ subscribe, get }, fn);

		// have to spread in order to preserve argument count
		const scan: Signal<T>["scan"] = (...args: any) =>
			(ScannedSignal as any)({ subscribe, get }, ...args);

		const zip = (...signals: MinimalSignal<any>[]): Signal<any> =>
			ZippedSignal({ subscribe, get }, ...signals);

		return {
			subscribe,
			get,
			map,
			enumerate,
			flat,
			flatMap,
			count,
			tap,
			scan,
			zip,
		};
	},

	fromMinimal<T>(signal: MinimalSignal<T>): Signal<T> {
		let unsub: Unsubscriber = () => {};
		let value: T | undefined;
		const subs = new Set<Subscriber<T>>();
		const invs = new Set<Invalidator>();
		const deferred = new MapSet<Subscriber<T>, Unsubscriber>();

		const start = () => {
			unsub = signal.subscribe(
				(val) => {
					for (const d of deferred.flatValues()) d();
					deferred.clear();

					const oldValue = value;
					value = val;

					for (const s of subs) {
						const defer = (d: Unsubscriber) => deferred.add(s, d);
						s(val, { oldValue, defer });
					}
				},
				() => {
					invs.forEach((i) => i());
				},
			);
		};
		const stop = () => {
			unsub();
			unsub = () => {};
		};

		const subscribe = (s: Subscriber<T>, i?: Invalidator) => {
			if (subs.size === 0) start();

			subs.add(s);
			if (i) invs.add(i);

			const defer = (d: Unsubscriber) => deferred.add(s, d);
			s(value!, { oldValue: value, defer });

			return () => {
				subs.delete(s);
				if (i) invs.delete(i);
				for (const d of deferred.get(s) ?? []) d();
				deferred.delete(s);
				if (subs.size === 0) stop();
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

	isReadable(s: any): s is MinimalSignal<any> {
		return (
			(typeof s === "object" || typeof s === "function") &&
			"subscribe" in s &&
			typeof s.subscribe === "function"
		);
	},

	isWritable(s: any): s is WriteonlySignal<any> {
		return (
			(typeof s === "object" || typeof s === "function") &&
			"set" in s &&
			typeof s.set === "function"
		);
	},
};
