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
	Validator,
} from "./types.ts";
import { SignalWithHistory } from "./withHistory.ts";
import { ZippedSignal } from "./zip.ts";

export interface Signal<T> extends MinimalSignal<T> {
	subscribe(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
		validate?: Validator,
	): Unsubscriber;

	listen(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
		validate?: Validator,
	): Unsubscriber;

	get(): T;
	map<S>(fn: (value: T) => S): Signal<S>;
	enumerate(): Signal<[number, T]>;
	flat<D extends number = 1>(
		depth?: D,
	): Signal<FlatSignal<Signal<T>, D>>;
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

	withHistory(): SignalWithHistory<T, 2>;
	withHistory<N extends number>(howMany: N): SignalWithHistory<T, N>;
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
			validate?: Validator,
		) => {
			let synchronousRun = true;
			const unsub = subscribe(
				(...args) => {
					if (!synchronousRun) subscriber(...args);
				},
				invalidate,
				validate,
			);
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

		const withHistory = (n = 2): Signal<any> =>
			SignalWithHistory({ subscribe, get }, n);

		const zip = (...signals: MinimalSignal<any>[]): Signal<any> =>
			ZippedSignal({ subscribe, get }, ...signals);

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
			withHistory,
			zip,
		};
	},

	fromMinimal<T>(signal: MinimalSignal<T>): Signal<T> {
		let unsub: Unsubscriber = () => {};
		let value: T | undefined;
		const subs = new Set<Subscriber<T>>();
		const invs = new Set<Invalidator>();
		const vals = new Set<Validator>();
		const defered = new MapSet<Subscriber<T>, Unsubscriber>();

		const start = () => {
			unsub = signal.subscribe(
				(v) => {
					for (const d of defered.flatValues()) d();
					defered.clear();

					const prev = value;
					value = v;

					for (const s of subs) {
						const defer = (d: Unsubscriber) => defered.add(s, d);
						s(v, { prev, defer });
					}
				},
				() => {
					invs.forEach((f) => f());
				},
				() => {
					vals.forEach((f) => f());
				},
			);
		};
		const stop = () => {
			unsub();
			unsub = () => {};
		};

		const subscribe = (
			s: Subscriber<T>,
			i?: Invalidator,
			v?: Validator,
		) => {
			if (subs.size === 0) start();

			subs.add(s);
			if (i) invs.add(i);
			if (v) vals.add(v);

			const defer = (d: Unsubscriber) => defered.add(s, d);
			s(value!, { prev: value, defer });

			return () => {
				subs.delete(s);
				if (i) invs.delete(i);
				if (v) vals.delete(v);
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
