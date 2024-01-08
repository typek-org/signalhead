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
	Unsubscriber,
	Invalidator,
	WriteonlySignal,
	SignalArrayValues,
} from "./types.ts";
import { ZippedSignal } from "./zip.ts";
import { SignalWithDefault } from "./default.ts";

export interface Signal<T> extends MinimalSignal<T> {
	subscribe(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
	): Unsubscriber;

	listen(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
	): Unsubscriber;

	get(): T;
	map<S>(fn: (value: T) => S): Signal<S>;
	enumerate(): Signal<[number, T]>;
	flat<D extends number = 1>(depth?: D): FlatSignal<Signal<T>, D>;
	flatMap<S>(fn: (value: T) => S | Signal<S>): Signal<S>;
	count(): Signal<number>;

	scan(fn: (prev: T, curr: T) => T): Signal<T>;
	scan(fn: (prev: T, curr: T) => T, initialValue: T): Signal<T>;
	scan<U>(fn: (prev: U, curr: T) => U, initialValue: U): Signal<U>;

	zip<U>(other: MinimalSignal<U>): Signal<[T, U]>;
	zip<U, V>(
		other1: MinimalSignal<U>,
		other2: MinimalSignal<V>,
	): Signal<[T, U, V]>;
	zip<U extends MinimalSignal<any>[]>(
		...signals: U
	): Signal<SignalArrayValues<U>>;

	tap(
		fn: (value: T) => void,
		options?: { keepAlive?: boolean },
	): Signal<T>;

	withDefault(
		d: MinimalSignal<NonNullable<T>>,
	): SignalWithDefault<NonNullable<T>>;
	withDefault(d: MinimalSignal<T>): SignalWithDefault<T>;
}

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
		const listen = (
			subscriber: Subscriber<T>,
			invalidate?: Invalidator,
		) => {
			let synchronousRun = true;
			const unsub = subscribe((...args) => {
				if (!synchronousRun) subscriber(...args);
			}, invalidate);
			synchronousRun = false;
			return unsub;
		};

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

		const withDefault = (d: MinimalSignal<any>) =>
			SignalWithDefault({ subscribe, get }, d);

		return {
			subscribe,
			listen,
			get,
			map,
			enumerate,
			flat,
			flatMap,
			count,
			tap,
			scan,
			withDefault,
			zip,
		};
	},

	fromMinimal<T>(signal: MinimalSignal<T>): Signal<T> {
		let unsub: Unsubscriber = () => {};
		let value: T | undefined;
		const subs = new Set<Subscriber<T>>();
		const invs = new Set<Invalidator>();
		const defered = new MapSet<Subscriber<T>, Unsubscriber>();

		const start = () => {
			unsub = signal.subscribe(
				(val) => {
					for (const d of defered.flatValues()) d();
					defered.clear();

					const oldValue = value;
					value = val;

					for (const s of subs) {
						const defer = (d: Unsubscriber) => defered.add(s, d);
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

			const defer = (d: Unsubscriber) => defered.add(s, d);
			s(value!, { oldValue: value, defer });

			return () => {
				subs.delete(s);
				if (i) invs.delete(i);
				for (const d of defered.get(s) ?? []) d();
				defered.delete(s);
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
