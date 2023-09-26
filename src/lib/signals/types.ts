import { FlatSignal } from "./flat.ts";

export type MinimalSubscriber<T> = (value: T) => void;
export type Unsubscriber = () => void;
export type Invalidator = () => void;
export type Updater<T> = (value: T) => T;

export type SignalValue<S extends MinimalSignal<any>> =
	S extends MinimalSignal<infer V> ? V : never;
export type SignalArrayValues<S extends MinimalSignal<any>[]> =
	S extends [
		infer T extends MinimalSignal<any>,
		...infer U extends MinimalSignal<any>[],
	]
		? [SignalValue<T>, ...SignalArrayValues<U>]
		: [];

export interface SubscriberParams<T> {
	oldValue: T | undefined;
	defer(destructor: () => void): void;
}
export type Subscriber<T> = (
	value: T,
	params: SubscriberParams<T>,
) => void;

export interface MinimalSignal<T> {
	subscribe(
		subscriber: MinimalSubscriber<T>,
		invalidate?: Invalidator,
	): Unsubscriber;

	get?(): T;
}

export interface ISignal<T> extends MinimalSignal<T> {
	subscribe(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
	): Unsubscriber;

	get(): T;
	map<S>(fn: (value: T) => S): ISignal<S>;
	enumerate(): ISignal<[number, T]>;
	flat<D extends number = 1>(depth?: D): FlatSignal<ISignal<T>, D>;
	flatMap<S>(fn: (value: T) => S | ISignal<S>): ISignal<S>;
	count(): ISignal<number>;

	scan(fn: (prev: T, curr: T) => T): ISignal<T>;
	scan(fn: (prev: T, curr: T) => T, initialValue: T): ISignal<T>;
	scan<U>(fn: (prev: U, curr: T) => U, initialValue: U): ISignal<U>;

	zip<U>(other: MinimalSignal<U>): ISignal<[T, U]>;
	zip<U, V>(
		other1: MinimalSignal<U>,
		other2: MinimalSignal<V>,
	): ISignal<[T, U, V]>;
	zip<U extends MinimalSignal<any>[]>(
		...signals: U
	): ISignal<SignalArrayValues<U>>;

	tap(
		fn: (value: T) => void,
		options?: { keepAlive?: boolean },
	): ISignal<T>;
}

export interface WriteonlySignal<T> {
	set(value: T): void;
}

export interface MinimalWritableSignal<T>
	extends MinimalSignal<T>,
		WriteonlySignal<T> {}

export interface IWritableSignal<T>
	extends ISignal<T>,
		Omit<MinimalWritableSignal<T>, "get" | "subscribe"> {
	update(fn: Updater<T>): void;
	toReadonly(): ISignal<T>;
	toWriteonly(): WriteonlySignal<T>;

	/**
	 * Creates a new WritableSignal whose `set` and `update` methods
	 * are mapped using the provided callback `fn`. Use this functionality
	 * to normalize the input or throw an error on invalid state.
	 *
	 * **FOOTGUN WARNING**: Only ever use this method to transform
	 * the input into a logically equivalent form, or to reject invalid
	 * input. If you wanted to use it for more general two-way data
	 * binding, consider using an ordinary mapped readable signal
	 * together with an imperative function (eg. _foo_ & _setFooState_).
	 * That way there'd only be a single source of truth, which is always
	 * preferable.
	 */
	withMappedSetter(fn: (value: T) => T): IWritableSignal<T>;
}
