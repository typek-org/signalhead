import {
	MinimalSignal,
	MinimalSubscriber,
	PipeOf,
	Signal,
	Unsubscriber,
	mut,
	pipableOf,
	range,
} from "../mod.ts";
import { MappedList } from "./map.ts";
import { MutList } from "./writable.ts";

export type ListUpdate<T> =
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

export type ListUpdateSubscriber<T> = MinimalSubscriber<
	Array<ListUpdate<T>>
>;

export interface MinimalList<T> {
	length: Signal<number>;
	getAt(index: number): T | undefined;
	listenToUpdates(sub: ListUpdateSubscriber<T>): Unsubscriber;
}

export interface List<T> extends MinimalList<T>, PipeOf<List<T>> {
	// at(index: number | Signal<number>): Signal<T | undefined>;
	toArray(): Signal<T[]>;
	iter(): Iterable<T>;

	// every(fn: (value: T) => unknown): Signal<boolean>;
	// some(fn: (value: T) => unknown): Signal<boolean>;
	// includes(value: T): Signal<boolean>;

	// filter<S extends T>(fn: (value: T) => value is S): List<S>;
	// filter(fn: (value: T) => unknown): List<T>;
	map<S>(fn: (value: T | undefined) => S | undefined): List<S>;

	// findAny<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findAny(fn: (value: T) => unknown): Signal<T | undefined>;
	// findFirst<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findFirst(fn: (value: T) => unknown): Signal<T | undefined>;
	// findLast<S extends T>(fn: (v: T) => v is S): Signal<S | undefined>;
	// findLast(fn: (value: T) => unknown): Signal<T | undefined>;

	// findAnyIndex(fn: (v: T) => unknown): Signal<number | undefined>;
	// findFirstIndex(fn: (v: T) => unknown): Signal<number | undefined>;
	// findLastIndex(fn: (v: T) => unknown): Signal<number | undefined>;

	// reversed(): List<T>;
	// sorted(fn: (a: T, b: T) => number): List<T>;
	// sortedNumerically(fn?: (v: T) => number): List<T>;
	// spliced(
	// 	start: number | Signal<number>,
	// 	deleteCount: number | Signal<number>,
	// 	items?: T[] | Signal<T[]> | List<T>,
	// ): List<T>;

	// slice(start?: number, end?: number): List<T>;

	// with(index: number | Signal<number>, value: T | Signal<T>): List<T>;
}

const createReadableList = <T>(
	...items: Array<T | MinimalSignal<T>>
): List<T> => {
	const list = MutList(
		items.map((s) => (Signal.isReadable(s) ? Signal.get(s) : s)),
		{
			onStart({ defer }) {
				for (const index of range(items.length)) {
					const item = items[index];
					if (!Signal.isReadable(item)) continue;
					defer(
						item.subscribe((value) => {
							list.setAt(index, value);
						}),
					);
				}
			},
		},
	);
	return list;
};

export const List = Object.assign(createReadableList, {
	fromMinimal<T>(list: MinimalList<T>): List<T> {
		const { length, getAt, listenToUpdates } = list;

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
			MappedList({ length, getAt, listenToUpdates }, fn);

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
