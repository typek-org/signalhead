import {
	MinimalSignal,
	MinimalSubscriber,
	Pipable,
	PipeOf,
	Signal,
	Unsubscriber,
	mut,
	pipableOf,
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

export interface MinimalPack<T> {
	length: Signal<number>;
	getAt(index: number): T | undefined;
	listenToUpdates(sub: PackUpdateSubscriber<T>): Unsubscriber;
}

export interface Pack<T> extends MinimalPack<T>, PipeOf<Pack<T>> {
	listenToUpdates(
		sub: PackUpdateSubscriber<T>,
	): Pipable<Unsubscriber>;

	// at(index: number | Signal<number>): Signal<T | undefined>;
	toArray(): Signal<T[]>;
	iter(): Iterable<T>;

	// every(fn: (value: T) => unknown): Signal<boolean>;
	// some(fn: (value: T) => unknown): Signal<boolean>;
	// includes(value: T): Signal<boolean>;

	// filter<S extends T>(fn: (value: T) => value is S): Pack<S>;
	// filter(fn: (value: T) => unknown): Pack<T>;
	map<S>(fn: (value: T | undefined) => S | undefined): Pack<S>;

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

export const Pack = Object.assign(createReadablePack, {
	fromMinimal<T>(pack: MinimalPack<T>): Pack<T> {
		const { length, getAt, listenToUpdates: _listen } = pack;

		const listenToUpdates = (...args: Parameters<typeof _listen>) =>
			pipableOf(_listen(...args));

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

		const map = <S>(fn: (value: T | undefined) => S | undefined) =>
			MappedPack({ length, getAt, listenToUpdates }, fn);

		return pipableOf({
			length,
			getAt,
			iter,
			toArray,
			map,
			listenToUpdates,
		});
	},
});
