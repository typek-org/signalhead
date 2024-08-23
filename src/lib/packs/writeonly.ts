import { type Pipable, toPipable } from "@typek/typek";
import {
	type Unsubscriber,
	type WritableSignal,
	mut,
} from "../mod.ts";
import { Defer } from "../utils/defer.ts";
import type { PackUpdate, PackUpdateSubscriber } from "./readable.ts";
import type { MutPackOptions } from "./writable.ts";

export interface WriteonlyPack<T> {
	length: WritableSignal<number>;
	setAt(index: number, value: T): void;

	push(...items: T[]): number;
	unshift(...items: T[]): number;

	insertAt(index: number, value: T): void;
	moveToIndex(fromIndex: number, toIndex: number): void;
	swap(index1: number, index2: number): void;
	deleteAt(index: number): void;

	// fill(value: T, start?: number, end?: number): void;
	// copyWithin(target: number, start: number, end?: number): void;

	// splice(
	// 	start: number | Signal<number>,
	// 	deleteCount: number | Signal<number>,
	// 	items?: Iterable<T>,
	// ): void;

	// reverse(): void;

	listenToUpdates(
		sub: PackUpdateSubscriber<T>,
	): Pipable<Unsubscriber>;
}

export const WriteonlyPack = <T>(
	len = 0,
	{ onStart, onStop }: MutPackOptions = {},
): WriteonlyPack<T> => {
	const length$ = mut(len);

	const subs = new Set<PackUpdateSubscriber<T>>();
	const { defer, cleanup } = Defer.create();

	const listenToUpdates = (sub: PackUpdateSubscriber<T>) => {
		if (subs.size === 0) onStart?.({ defer });

		subs.add(sub);
		return toPipable(() => {
			subs.delete(sub);

			if (subs.size === 0) {
				cleanup();
				onStop?.();
			}
		});
	};

	const resolveIndex = (index: number) => {
		const length = length$.get();
		if (index < 0) index = length + index;
		if (index < 0 || index > length) {
			throw new RangeError("Index out of range");
		}
		return index;
	};

	const insertAt = (index: number, value: T) => {
		index = resolveIndex(index);
		const updates: PackUpdate<T>[] = [
			{ type: "insert", index, value },
		];
		length$.update((len) => len + 1);
		for (const s of [...subs]) s(updates);
	};

	const moveToIndex = (fromIndex: number, toIndex: number) => {
		fromIndex = resolveIndex(fromIndex);
		toIndex = resolveIndex(toIndex);
		if (fromIndex === toIndex) return;

		const updates: PackUpdate<T>[] = [
			{ type: "move", fromIndex, toIndex },
		];
		for (const s of [...subs]) s(updates);
	};

	const deleteAt = (index: number) => {
		index = resolveIndex(index);
		const updates: PackUpdate<T>[] = [{ type: "delete", index }];
		length$.update((len) => len - 1);
		for (const s of [...subs]) s(updates);
	};

	const setAt = (index: number, value: T) => {
		const updates: PackUpdate<T>[] = [];

		if (index < length$.get()) {
			updates.push({ type: "modify", index, value });
		} else {
			for (let i = length$.get(); i < index; i++) {
				updates.push({ type: "insert", index: i, value: undefined });
			}

			updates.push({ type: "insert", index, value });
			length$.set(index + 1);
		}

		for (const s of [...subs]) s(updates);
	};

	const push = (...items: T[]) => {
		let index = length$.get();
		const updates: PackUpdate<T>[] = [];

		for (const value of items) {
			updates.push({ type: "insert", index, value });
			index += 1;
		}

		length$.set(index);
		for (const s of [...subs]) s(updates);

		return length$.get();
	};

	const unshift = (...items: T[]) => {
		const updates: PackUpdate<T>[] = [];
		items.reverse();

		for (const value of items) {
			updates.push({ type: "insert", index: 0, value });
		}

		length$.update((len) => len + items.length);
		for (const s of [...subs]) s(updates);

		return length$.get();
	};

	const swap = (i: number, j: number) => {
		i = resolveIndex(i);
		j = resolveIndex(j);
		if (i === j) return;

		const [lower, higher] = [Math.min(i, j), Math.max(i, j)];

		// Swapping 3 and 7:
		// [0, 1, 2, 3, 4, 5, 6, 7, 8] move 3 to index 7
		// [0, 1, 2, 4, 5, 6, 7, 3, 8] move 6 to index 3
		// [0, 1, 2, 7, 4, 5, 6, 3, 8]

		const updates: PackUpdate<T>[] = [
			{ type: "move", fromIndex: lower, toIndex: higher },
			{ type: "move", fromIndex: higher - 1, toIndex: lower },
		];
		for (const s of [...subs]) s(updates);
	};

	const publicLength = length$.withSetterSideEffect(
		(value, { prev }) => {
			const diff = value - prev!;
			const updates: PackUpdate<T>[] = [];

			if (diff < 0) {
				for (let index = prev! - 1; index >= value; index--) {
					updates.push({ type: "delete", index });
				}
			} else {
				for (let index = prev!; index < value; index++) {
					updates.push({ type: "insert", index, value: undefined });
				}
			}

			for (const s of [...subs]) s(updates);

			return value;
		},
	);

	return {
		length: publicLength,
		setAt,
		push,
		unshift,
		insertAt,
		moveToIndex,
		swap,
		deleteAt,
		listenToUpdates,
	};
};
