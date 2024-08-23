import { type PipeOf, toPipable } from "@typek/typek";
import {
	type MinimalSubscriber,
	type Signal,
	type Unsubscriber,
	mut,
} from "../mod.ts";

export type FlockUpdate<T> =
	| {
			type: "add";
			value: T;
	  }
	| {
			type: "delete";
			value: T;
	  }
	| {
			type: "clear";
	  };

export type FlockUpdateSubscriber<T> = MinimalSubscriber<
	Array<FlockUpdate<T>>
>;

export interface MinimalFlock<T> {
	size: Signal<number>;
	has(value: T): boolean;
	listenToUpdates(sub: FlockUpdateSubscriber<T>): Unsubscriber;
	iter(): Iterable<T>;
}

/**
 * A reactive counterpart to `ReadonlySet<T>`.
 *
 * **Unstable:** This API is experimental and subject
 * to change in future versions. If you use it, please
 * [provide feedback](https://github.com/m93a/signalhead/issues)!
 * We're especially interested in your use cases, and
 * what inconveniences you ran into while using it.
 */

export interface Flock<T> extends MinimalFlock<T>, PipeOf<Flock<T>> {
	toSet(): Signal<Set<T>>;
}

export const Flock: {
	fromMinimal<T>(flock: MinimalFlock<T>): Flock<T>;
} = {
	fromMinimal<T>(flock: MinimalFlock<T>): Flock<T> {
		const toSet = () => {
			const set = mut(new Set(flock.iter()), {
				onStart({ defer }) {
					defer(
						flock.listenToUpdates(() =>
							set.set(new Set(flock.iter())),
						),
					);
				},
			});
			return set.toReadonly();
		};
		return toPipable({ ...flock, toSet });
	},
};
