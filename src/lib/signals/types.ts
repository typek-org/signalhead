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

	get?(): T | undefined;
}

export interface Signal<T> extends MinimalSignal<T> {
	subscribe(
		subscriber: Subscriber<T>,
		invalidate?: Invalidator,
	): Unsubscriber;

	get(): T | undefined;
	map<S>(fn: (value: T) => S): Signal<S>;
	enumerate(): Signal<[number, T]>;
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
}

export interface WriteonlySignal<T> {
	set(value: T): void;
}

export interface MinimalWritableSignal<T>
	extends MinimalSignal<T>,
		WriteonlySignal<T> {}

export interface WritableSignal<T>
	extends Signal<T>,
		Omit<MinimalWritableSignal<T>, "get" | "subscribe"> {
	update(fn: Updater<T>): void;
	toReadonly(): Signal<T>;
	toWriteonly(): WriteonlySignal<T>;
}
