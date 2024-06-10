import { MapSet } from "../utils/collections.ts";
import { CountedSignal } from "./count.ts";
import { TappedSignal, TappedSignalOptions } from "./tap.ts";
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
	SubscriberParams,
} from "./types.ts";
import { SignalWithHistory } from "./withHistory.ts";
import { ZippedSignal } from "./zip.ts";
import { FilteredSignal } from "./filter.ts";
import { SkippedSignal } from "./skip.ts";
import { SignalWithSkippedEqual } from "./skipEqual.ts";
import { AwaitedSignal } from "./awaited.ts";
import { Pipable, PipeOf, pipableOf } from "../mod.ts";
import { Defer, DeferLike } from "../utils/defer.ts";
import { KeepAliveSignal } from "./keepAlive.ts";

export interface Signal<T>
	extends MinimalSignal<T>,
		PipeOf<Signal<T>> {
	/**
	 * Adds a subscriber to this signal, which is a callback that will
	 * be called immediately with the current value and then on every
	 * subsequent update of the signal with the new value.
	 *
	 * Returns an unsubscriber, which is a function that, once called,
	 * unregisters this subscriber.
	 *
	 * @see {Signal#listen}
	 */
	subscribe(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
		validate?: Validator,
	): Pipable<Unsubscriber>;

	/**
	 * Adds a listener, which is like a subscriber but it's **not** called
	 * immediately, only on subsequent updates. Returns an unsubscriber.
	 *
	 * @see {Signal#subscribe}
	 */
	listen(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
		validate?: Validator,
	): Pipable<Unsubscriber>;

	get(): T;

	awaited(): AwaitedSignal<Awaited<T>>;

	/**
	 * Given a source signal and a transformation function, returns a new
	 * signal that updates whenever the source signal updates. This signal's
	 * value is computed from the source using the transformation funciton.
	 *
	 * As all signals, mapped signals are lazy – therefore no subscription
	 * to the source signal is made until it is needed. Because of this,
	 * the transformation function won't be unless somebody subscribes to the
	 * mapped signal or tries to `.get()` its value.
	 *
	 * @example
	 * const num = mut(1);
	 * const doubleNum = num.map(n => 2 * n);
	 * doubleNum.subscribe(x => console.log(x)); // logs 2
	 * num.set(2); // logs 4
	 *
	 * @see {MappedSignal}
	 * @see {derived}
	 */
	map<S>(fn: (value: T, params: SubscriberParams<T>) => S): Signal<S>;

	/**
	 * Takes a signal and produces a new signal containing the original
	 * value accompanied by a number which increases by one every time
	 * the source signal updates.
	 *
	 * **FOOTGUN WARNING**: Because of the lazy nature of signals,
	 * the index will be incorrect if this signal loses all
	 * subscribers. To ensure the correct result regardless of the
	 * subscriber count, use as `s.enumerate().keepAlive(d)` with a
	 * suitable abort controller.
	 *
	 * @see {Signal#keepAlive}
	 */
	enumerate(): Signal<[number, T]>;

	/**
	 * Given a signal and a filtering function, produces a new signal
	 * that updates if the source signal updates and the callback returns
	 * `true` for the new value.
	 */
	filter(
		fn: (value: T, params: SubscriberParams<T>) => boolean,
	): Signal<T | undefined>;
	filter(
		fn: (value: T, params: SubscriberParams<T>) => boolean,
		initialValue: T,
	): Signal<T>;

	flat<D extends number = 1>(
		depth?: D,
	): Signal<FlatSignal<Signal<T>, D>>;
	flatMap<S>(
		fn: (value: T, params: SubscriberParams<T>) => S | Signal<S>,
	): Signal<S>;

	/**
	 * Produces a new signal containing a number
	 * which increases by one every time the source signal updates.
	 *
	 * **FOOTGUN WARNING**: Because of the lazy nature of signals,
	 * the value of this signal will be incorrect if it loses all
	 * subscribers. To ensure the correct result regardless of the
	 * subscriber count, use as `s.count().keepAlive(d)` with a
	 * suitable abort controller.
	 *
	 * @see {Signal#keepAlive}
	 */
	count(): Signal<number>;

	/**
	 * Given an aggregator function, produces a new
	 * signal whose value will be computed from the source signal's
	 * new value and this signal's previous value.
	 *
	 * As all signals are lazy, a scanned signal will not track its
	 * source until it has a subscriber. If you want to avoid loosing
	 * values, use `s.scan(...).keepAlive(d)` with a proper abort signal.
	 *
	 * @see {Signal#keepAlive}
	 */
	scan(fn: (prev: T, curr: T) => T): Signal<T>;
	scan(fn: (prev: T, curr: T) => T, initialValue: T): Signal<T>;
	scan<U>(fn: (prev: U, curr: T) => U, initialValue: U): Signal<U>;

	/**
	 * Given a signal and a filtering function, produces a new signal
	 * that updates if the source signal updates and the callback returns
	 * `false` for the new value.
	 */
	skip(
		fn: (value: T, params: SubscriberParams<T>) => boolean,
	): Signal<T | undefined>;
	skip(
		fn: (value: T, params: SubscriberParams<T>) => boolean,
		initialValue: T,
	): Signal<T>;

	/**
	 * Produces a new signal whose value only updates if it
	 * is not strictly equal to the old value.
	 */
	skipEqual(): Signal<T>;

	/**
	 * Given several signals, returns a new signal whose value is a tuple of the source
	 * signals' values. Updates every time one of the source signals updates. If multiple
	 * signals are updated at once, the zipped signal only updates once.
	 */
	zip<U>(other: MinimalSignal<U>): Signal<[T, U]>;
	zip<U, V>(
		other1: MinimalSignal<U>,
		other2: MinimalSignal<V>,
	): Signal<[T, U, V]>;
	zip<U extends MinimalSignal<any>[]>(
		...signals: U
	): Signal<[T, ...SignalArrayValues<U>]>;

	/**
	 * Ensures a signal is kept alive even if it has no subscribers, until
	 * this action is canceled by the provided abort signal.
	 */
	keepAlive(unsub: DeferLike): Signal<T>;

	/**
	 * Provided a callback, returns a new signal that will call the callback on
	 * every update. Since signals are lazy, **no update will actually happen** unless
	 * somebody actually subscribes to the signal. This is super useful for debugging
	 * the actual movement of values in your data pipelines. If you want to log every
	 * update regardless whether somebody is subscribed, use either
	 * `s.subscribe(x => console.log(x))`, or `s.tap(x => console.log(x), { keepAlive: true })`.
	 *
	 * @example
	 * const greeting = mut("Hello");
	 * const name = mut("John");
	 * const message =
	 *   greeting
	 *     .zip(name)
	 *     .map(([greet, name]) => `${greet}, ${name}!`)
	 *     .tap(s => console.log(s));
	 * // doesn't log anything right away
	 *
	 * name.set('Joe');
	 * // still doesn't log anything, because message has no subscribers
	 *
	 * message.get(); // logs "Hello, Joe"
	 * message.subscribe(() => {}); // logs "Hello, Joe"
	 * greeting.set("Greetings") // logs "Greetings, Joe"
	 *
	 * @see {TappedSignal}
	 * @see {Signal#keepAlive}
	 */
	tap(
		fn: (value: T, params: SubscriberParams<T>) => void,
		options?: TappedSignalOptions,
	): Signal<T>;

	/**
	 * Takes a signal, and produces a new signal which collects the last
	 * few values of the former one into an array. The most current value
	 * is always in the first one in the array, the previous value is second,
	 * etc. It is similar to the NPM package `svelte-previous` or to Rust's
	 * `slice::windows` method.
	 *
	 * As all signals are lazy, SignalWithHistory will not subscribe to
	 * its dependency immediately, but only once it has any subscribers
	 * itself – and will unsubscribe from its dependency once all its
	 * subscribers unsubscribe. This means that historic values are not
	 * tracked while there are no subscribers – if you need them, use
	 * `s.withHistory().keepAlive(d)` with a suitable abort signal.
	 *
	 * @example
	 * const a = mut(42);
	 * const b = a.withHistory(3);
	 *
	 * a.set(69);
	 * b.subscribe(console.log); // [69, 69, 69]
	 * // the history was not tracked while there were no subscribers
	 *
	 * a.set(-12); // b: [-12, 69, 69]
	 * a.set(420); // b: [420, -12, 69]
	 * a.set(3); // b: [3, 420, -12]
	 *
	 * @see {Readable#keepAlive}
	 */
	withHistory(): SignalWithHistory<T, 2>;
	withHistory<N extends number>(howMany: N): SignalWithHistory<T, N>;
}

export interface SignalSubscribeAndGet<T> {
	subscribe(
		...args: Parameters<Signal<T>["subscribe"]>
	): Unsubscriber;
	get: Signal<T>["get"];
}

export const Signal = {
	get<T>(signal: MinimalSignal<T>): T {
		if (signal.get) return signal.get()!;

		let value!: T;
		signal.subscribe((v) => (value = v))();
		return value;
	},

	fromSubscribeAndGet<T>({
		subscribe: unpipableSubscribe,
		get,
	}: SignalSubscribeAndGet<T>): Signal<T> {
		const subscribe = (
			...args: Parameters<typeof unpipableSubscribe>
		) => pipableOf(unpipableSubscribe(...args));

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

		const awaited = () => AwaitedSignal({ subscribe, get });

		const keepAlive = (d: DeferLike) =>
			KeepAliveSignal({ subscribe, get }, d);

		const map = <S>(
			fn: (value: T, params: SubscriberParams<T>) => S,
		) => MappedSignal({ subscribe, get }, fn);

		const enumerate = () => EnumeratedSignal({ subscribe, get });
		const count = () => CountedSignal({ subscribe, get });

		const tap = (
			listener: (value: T, params: SubscriberParams<T>) => void,
			options?: { keepAlive?: boolean },
		) => TappedSignal({ subscribe, get }, listener, options);

		const filter = (
			fn: (v: T, params: SubscriberParams<T>) => boolean,
			initialValue?: T,
		) => FilteredSignal({ subscribe, get }, fn, initialValue!);

		const flat = <D extends number>(depth?: D): any =>
			FlatSignal({ subscribe, get }, depth);

		const flatMap = <S>(
			fn: (
				value: T,
				params: SubscriberParams<T>,
			) => S | MinimalSignal<S>,
		) => FlatMappedSignal({ subscribe, get }, fn);

		// have to spread in order to preserve argument count
		const scan: Signal<T>["scan"] = (...args: any) =>
			(ScannedSignal as any)({ subscribe, get }, ...args);

		const skip = (
			fn: (v: T, params: SubscriberParams<T>) => boolean,
			initialValue?: T,
		) => SkippedSignal({ subscribe, get }, fn, initialValue!);

		const skipEqual = () =>
			SignalWithSkippedEqual({ subscribe, get });

		const withHistory = (n = 2): Signal<any> =>
			SignalWithHistory({ subscribe, get }, n);

		const zip = (...signals: MinimalSignal<any>[]): Signal<any> =>
			ZippedSignal({ subscribe, get }, ...signals);

		return pipableOf({
			subscribe,
			listen,
			get,
			awaited,
			keepAlive,
			map,
			enumerate,
			filter,
			flat,
			flatMap,
			count,
			tap,
			skip,
			skipEqual,
			scan,
			withHistory,
			zip,
		});
	},

	fromMinimal<T>(signal: MinimalSignal<T>): Signal<T> {
		let unsub: Unsubscriber = () => {};
		let value: T | undefined;
		let cold = true;
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

					for (const s of [...subs]) {
						const defer = Defer.from((d: Unsubscriber) =>
							defered.add(s, d),
						);

						s(v, {
							prev,
							defer,
							isFirstRun: false,
							isColdStart: cold,
						});
					}

					cold = false;
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
			cold = true;
			unsub();
			unsub = () => {};
		};

		const subscribe = (
			s: Subscriber<T>,
			i?: Invalidator,
			v?: Validator,
		) => {
			let isColdStart = false;
			if (subs.size === 0) {
				isColdStart = true;
				start();
			}

			subs.add(s);
			if (i) invs.add(i);
			if (v) vals.add(v);

			const defer = Defer.from((d) => defered.add(s, d));
			s(value!, {
				prev: value,
				defer,
				isFirstRun: true,
				isColdStart,
			});

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
