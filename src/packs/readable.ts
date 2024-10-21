import { type Pipable, type PipeOf, toPipable } from "@typek/typek";
import {
	Defer,
	type MinimalSignal,
	type MinimalSubscriber,
	Signal,
	type Unsubscriber,
	mut,
	range,
} from "../mod.ts";
import { MappedPack } from "./map.ts";
import { MutPack } from "./writable.ts";

export type PackUpdate<T> =
	| {
			type: "insert";
			index: number;
			value: T | undefined;
	  }
	| {
			type: "move";
			fromIndex: number;
			toIndex: number;
	  }
	| {
			type: "modify";
			index: number;
			value: T;
	  }
	| {
			type: "delete";
			index: number;
	  };

export type PackUpdateSubscriber<T> = MinimalSubscriber<
	Array<PackUpdate<T>>
>;

export interface ForEachParams<T> {
	/**
	 * A signal that updates every time the item changes its value.
	 */
	value: Signal<T | undefined>;

	/**
	 * A signal that updates every time the item changes its position
	 */
	index: Signal<number>;

	/**
	 * Mark a cleanup function to be called before this subscriber
	 * is called again, or once it is unsubscribed.
	 */
	defer: Defer;
}

export interface MinimalPack<T> {
	length: Signal<number>;
	getAt(index: number): T | undefined;
	listenToUpdates(sub: PackUpdateSubscriber<T>): Unsubscriber;
}

/**
 * A reactive counterpart to `ReadonlyArray<T>`.
 *
 * **Unstable:** This API is experimental and subject
 * to change in future versions. If you use it, please
 * [provide feedback](https://github.com/m93a/signalhead/issues)!
 * We're especially interested in your use cases, and
 * what inconveniences you ran into while using it.
 */
export interface Pack<T> extends MinimalPack<T>, PipeOf<Pack<T>> {
	listenToUpdates(
		sub: PackUpdateSubscriber<T>,
	): Pipable<Unsubscriber>;

	// at(index: number | Signal<number>): Signal<T | undefined>;
	toArray(): Signal<T[]>;
	iter(): Iterable<T>;

	/**
	 * Runs the callback for every item in the pack, and then
	 * for every item that is added to the pack. The callback
	 * receives: `params.value` which is a signal that updates
	 * every time the item changes its value, `params.index`
	 * which is a signal that updates every time the item changes
	 * its position in the pack, and `params.defer` which can
	 * be used to perform cleanup once the item is removed from
	 * the pack.
	 *
	 * The function itself returns an unsubscriber. By calling
	 * this unsubscriber, you opt out from any further updates.
	 * Upon calling the unsubscriber, the deferred cleanups of
	 * all items will be performed.
	 *
	 * The callback should **not** mutate the pack.
	 */
	forEach(
		fn: (params: ForEachParams<T>) => void,
	): Pipable<Unsubscriber>;

	// every(fn: (value: T) => unknown): Signal<boolean>;
	// some(fn: (value: T) => unknown): Signal<boolean>;
	// includes(value: T): Signal<boolean>;

	// filter<S extends T>(fn: (value: T) => value is S): Pack<S>;
	// filter(fn: (value: T) => unknown): Pack<T>;
	map<S>(fn: (value: T | undefined) => S | undefined): Pack<S>;

	/**  Reduces a Pack into a Signal in the same manner as `Array.prototype.reduce` does
	 *
	 * If only `include` is provided the entire pack is traversed and reduced with every update
	 *
	 * If also provided with `exclude`, on update will this function be used to remove values
	 * from the accumulator before adding in the new values
	 *
	 * The user is responsible for making sure `include(exclude) = Id`
	 * and that they commute when creating the accumulator
	 */
	reduce<S>(
		include: (acc: S, value: T | undefined, index: number) => S,
		initial: S,
		exclude?: (acc: S, value: T | undefined, index: number) => S,
	): Signal<S>;

	// findAny<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findAny(fn: (value: T) => unknown): Signal<T | undefined>;
	// findFirst<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findFirst(fn: (value: T) => unknown): Signal<T | undefined>;
	// findLast<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findLast(fn: (value: T) => unknown): Signal<T | undefined>;

	// findAnyIndex(fn: (v: T) => unknown): Signal<number | undefined>;
	// findFirstIndex(fn: (v: T) => unknown): Signal<number | undefined>;
	// findLastIndex(fn: (v: T) => unknown): Signal<number | undefined>;

	// reversed(): Pack<T>;
	// sorted(fn: (a: T, b: T) => number): Pack<T>;
	// sortedNumerically(fn?: (v: T) => number): Pack<T>;
	// spliced(
	// 	start: number | Signal<number>,
	// 	deleteCount: number | Signal<number>,
	// 	items?: T[] | Signal<T[]> | Pack<T>,
	// ): Pack<T>;

	// slice(start?: number, end?: number): Pack<T>;

	// with(index: number | Signal<number>, value: T | Signal<T>): Pack<T>;
}

const createReadablePack = <T>(
	...items: Array<T | MinimalSignal<T>>
): Pack<T> => {
	const pack = MutPack(
		items.map((s) => (Signal.isReadable(s) ? Signal.get(s) : s)),
		{
			onStart({ defer }) {
				for (const index of range(items.length)) {
					const item = items[index];
					if (!Signal.isReadable(item)) continue;
					defer(
						item.subscribe((value) => {
							pack.setAt(index, value);
						}),
					);
				}
			},
		},
	);
	return pack;
};

export const Pack: {
	<T>(...items: Array<T | MinimalSignal<T>>): Pack<T>;
	fromMinimal<T>(pack: MinimalPack<T>): Pack<T>;
	isPack(p: unknown): p is MinimalPack<unknown>;
} = Object.assign(createReadablePack, {
	isPack(p: unknown): p is MinimalPack<unknown> {
		return (
			(typeof p === "object" || typeof p === "function") &&
			p !== null &&
			"length" in p &&
			Signal.isReadable(p.length) &&
			"getAt" in p &&
			typeof p.getAt === "function" &&
			"listenToUpdates" in p &&
			typeof p.listenToUpdates === "function"
		);
	},
	fromMinimal<T>(pack: MinimalPack<T>): Pack<T> {
		const { length, getAt, listenToUpdates: _listen } = pack;

		const listenToUpdates = (...args: Parameters<typeof _listen>) =>
			toPipable(_listen(...args));

		const iter = function* (): Iterable<T> {
			for (let index = 0; index < length.get(); index++) {
				yield getAt(index)!;
			}
		};

		const toArray = () => {
			const arr = mut([...iter()], {
				onStart({ defer }) {
					defer(listenToUpdates(() => arr.set([...iter()])));
				},
			});
			return arr.toReadonly();
		};

		const forEach = (fn: (params: ForEachParams<T>) => void) => {
			const items = Array.from({ length: length.get() }).map(
				(_, i) => ({
					value: mut(getAt(i)),
					index: mut(i),
					defered: new Set<Unsubscriber>(),
				}),
			);

			for (const { value, index, defered } of items) {
				fn({
					value: value.toReadonly(),
					index,
					defer: Defer.from((f) => defered.add(f)),
				});
			}

			const unsub = listenToUpdates((updates) => {
				// TODO batch all updates

				for (const update of updates) {
					switch (update.type) {
						case "modify":
							items[update.index].value.set(update.value);
							break;
						case "move": {
							const [a, b] = [update.fromIndex, update.toIndex];
							items[a].index.set(b);
							if (a < b) {
								for (let i = a + 1; i <= b; i++) {
									items[i].index.set(i - 1);
								}
							} else {
								for (let i = b; i < a; i++) {
									items[i].index.set(i + 1);
								}
							}
							const [x] = items.splice(a, 1);
							items.splice(b, 0, x);
							break;
						}
						case "delete":
							items[update.index].defered.forEach((d) => d());
							for (let i = update.index + 1; i < items.length; i++) {
								items[i].index.set(i - 1);
							}
							items.splice(update.index, 1);
							break;
						case "insert": {
							const value = mut(update.value);
							const index = mut(update.index);
							const defered = new Set<Unsubscriber>();
							const defer = Defer.from((f) => defered.add(f));

							const item = { value, index, defered };
							fn({ value, index, defer });

							for (let i = update.index; i < items.length; i++) {
								items[i].index.set(i + 1);
							}

							items.splice(update.index, 0, item);
							break;
						}
					}
				}
			});

			return toPipable(() => {
				unsub();
				for (const { defered } of items) {
					defered.forEach((d) => d());
				}
				items.length = 0;
			});
		};

		const reduce = <S>(
			include: (acc: S, value: T | undefined, index: number) => S,
			initial: S,
			exclude?: (acc: S, value: T | undefined, index: number) => S,
		) => {
			if (exclude === undefined) {
				return toArray().map((arr) =>
					arr.reduce(
						(acc, value, index) => include(acc, value, index),
						initial,
					),
				);
			}

			const items = Array(length.get()).map((_, i) => getAt(i));

			const res = mut(
				items.reduce(
					(acc, curr, index) => include(acc, curr, index),
					initial,
				),
			);

			listenToUpdates((updates) =>
				updates.forEach((update) => {
					const oldValue = items.at(
						"index" in update ? update.index : update.fromIndex,
					);
					switch (update.type) {
						case "delete": {
							items.splice(update.index, 1);

							res.update((acc) =>
								exclude(acc, oldValue, update.index),
							);
							break;
						}
						case "insert": {
							items.splice(update.index, 0, update.value);
							res.update((acc) =>
								include(acc, update.value, update.index),
							);
							break;
						}
						case "move": {
							const [x] = items.splice(update.fromIndex, 1);
							items.splice(update.toIndex, 0, x);
							res.update((acc) => {
								const excludedAcc = exclude(
									acc,
									oldValue,
									update.fromIndex,
								);
								return include(excludedAcc, oldValue, update.toIndex);
							});

							break;
						}
						case "modify": {
							items[update.index] = update.value;
							res.update((acc) => {
								const excludedAcc = exclude(
									acc,
									oldValue,
									update.index,
								);
								return include(
									excludedAcc,
									update.value,
									update.index,
								);
							});
							break;
						}
					}
				}),
			);

			return res.toReadonly();
		};

		const map = <S>(fn: (value: T | undefined) => S | undefined) =>
			MappedPack({ length, getAt, listenToUpdates }, fn);

		return toPipable({
			length,
			getAt,
			iter,
			toArray,
			forEach,
			map,
			reduce,
			listenToUpdates,
		});
	},
});
