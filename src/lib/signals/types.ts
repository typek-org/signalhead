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

export interface WriteonlySignal<T> {
	set(value: T): void;
}

export interface MinimalWritableSignal<T>
	extends MinimalSignal<T>,
		WriteonlySignal<T> {
	invalidate?(): void;
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
