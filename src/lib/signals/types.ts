export type MinimalSubscriber<T> = (value: T) => void;
export type Unsubscriber = () => void;
export type Invalidator = () => void;
export type Validator = () => void;
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
	prev: T | undefined;
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
		validate?: Validator,
	): Unsubscriber;

	get?(): T;
}

export interface WriteonlySignal<T> {
	set(value: T): void;
}

export interface MinimalWritableSignal<T>
	extends MinimalSignal<T>,
		WriteonlySignal<T> {
	invalidate?(): void;
	validate?(): void;
}

export interface StartStop {
	/**
	 * Called when a subscriber is added to a previously subscriber-less signal.
	 */
	onStart?(props: { defer: (destructor: () => void) => void }): void;

	/**
	 * Called when all subscribers unsubscribe.
	 */
	onStop?(): void;
}

// prettier-ignore
export type TupleOf<T, N extends number> =
  N extends 0 ? [] :
  N extends 1 ? [T] :
  N extends 2 ? [T, T] :
  N extends 3 ? [T, T, T] :
  N extends 4 ? [T, T, T, T] :
  N extends 5 ? [T, T, T, T, T] :
  T[];
