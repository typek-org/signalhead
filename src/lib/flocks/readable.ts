import {
	MinimalSubscriber,
	PipeOf,
	Signal,
	Unsubscriber,
	mut,
	pipableOf,
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
		return pipableOf({ ...flock, toSet });
	},
};
