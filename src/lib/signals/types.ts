import type { Defer } from "../mod.ts";

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

/**
 * @template T - The type of the underlying signal's value.
 */
export interface SubscriberParams<T> {
	/**
	 * The previous value of this signal. On the subscriber's
	 * first run, it's identical to the current value, because
	 * signals do not cache their previous values.
	 *
	 * If you need to cache the previous value, consider using
	 * `signal.withHistory()`.
	 */
	prev: T | undefined;

	/**
	 * Mark a cleanup function to be called before this subscriber
	 * is called again, or once it is unsubscribed.
	 */
	defer: Defer;

	/**
	 * Subscribers are called immediately during subscription –
	 * on this call, `isFirstRun` will be `true`. On all subsequent
	 * calls of this subscriber, `isFirstRun` will be `false`.
	 */
	isFirstRun: boolean;

	/**
	 * Some signals perform special tasks once they get their first
	 * subscriber – ie. stop being _cold_ and become _hot_. The
	 * `isColdStart` will be `true` on the first run of the first
	 * subscriber added, and `false` on all subsequent calls.
	 */
	isColdStart: boolean;
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
	onStart?(props: { defer: Defer }): void;

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
