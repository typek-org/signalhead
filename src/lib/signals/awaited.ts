import { Signal } from "./readable";
import { MinimalSignal } from "./types";
import { mut } from "./writable";

export type AwaitedSignalResult<T> =
	| { status: "pending"; lastValue: T | undefined }
	| { status: "fulfilled"; value: T }
	| { status: "rejected"; reason: any; lastValue: T | undefined };

export interface AwaitedSignal<V>
	extends Signal<AwaitedSignalResult<V>> {
	lastFulfilled(): Signal<V | undefined>;
	currentlyFulfilled(): Signal<V | undefined>;
}

export const AwaitedSignal = <T>(
	signal: MinimalSignal<T>,
): AwaitedSignal<Awaited<T>> => {
	type V = Awaited<T>;
	let lastValue: V | undefined;

	const awaited = mut<AwaitedSignalResult<V>>(
		{ status: "pending", lastValue },
		{
			onStart({ defer }) {
				defer(
					signal.subscribe((promiseOrValue) => {
						awaited.set({
							status: "pending",
							lastValue,
						});

						// if a new promise is pushed during the asynchronous gap, do nothing
						let shouldUpdate = true;
						defer(() => (shouldUpdate = false));

						const promise = (async (): Promise<V> =>
							await promiseOrValue)();

						// Fulfilled
						promise.catch().then((value) => {
							if (!shouldUpdate) return;

							lastValue = value;
							awaited.set({ status: "fulfilled", value });
						});

						// Rejected
						promise.catch((reason) => {
							if (!shouldUpdate) return;
							awaited.set({
								status: "rejected",
								reason,
								lastValue,
							});
						});
					}),
				);
			},
		},
	);

	return {
		...awaited,
		lastFulfilled() {
			return LastFulfilledAwaitedSignal(signal);
		},
		currentlyFulfilled() {
			return CurrentlyFulfilledAwaitedSignal(signal);
		},
	};
};

export const LastFulfilledAwaitedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<Awaited<T> | undefined> => {
	type V = Awaited<T>;
	return AwaitedSignal(signal)
		.map((v): [value: V | undefined, update: boolean] => {
			switch (v.status) {
				case "pending":
				case "rejected":
					return [v.lastValue, false];
				case "fulfilled":
					return [v.value, true];
			}
		})
		.filter(([value, update], { prev }) =>
			value !== prev?.[0] ? true : update,
		)
		.map((v) => v?.[0]);
};

export const CurrentlyFulfilledAwaitedSignal = <T>(
	signal: MinimalSignal<T>,
): Signal<Awaited<T> | undefined> => {
	type V = Awaited<T>;
	return AwaitedSignal(signal)
		.map((v): [value: V | undefined, fulfilled: boolean] => {
			switch (v.status) {
				case "pending":
				case "rejected":
					return [undefined, false];
				case "fulfilled":
					return [v.value, true];
			}
		})
		.filter(([_, fulfilled], { prev }) => fulfilled !== prev?.[1])
		.map((v) => v?.[0]);
};
