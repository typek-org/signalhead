import { Unsubscriber, WritableSignal } from "../mod.ts";
import { List, ListUpdateSubscriber } from "./readable.ts";
import { WriteonlyList } from "./writeonly.ts";

export interface MutList<T> extends WriteonlyList<T>, List<T> {
	length: WritableSignal<number>;
	toReadonly(): List<T>;
	toWriteonly(): WriteonlyList<T>;

	pop(): T | undefined;
	shift(): T | undefined;
	popAt(index: number): T | undefined;

	// sort(fn: (a: T, b: T) => number): this;
	// sortNumerically(fn?: (v: T) => number): this;
}

export interface MutListOptions {
	/**
	 * Called when a subscriber is added to a previously subscriber-less signal.
	 */
	onStart?(props: { defer: (destructor: () => void) => void }): void;

	/**
	 * Called when all subscribers unsubscribe.
	 */
	onStop?(): void;
}

export const MutList = <T>(
	items: Iterable<T> = [],
	opts: MutListOptions = {},
): MutList<T> => {
	const arr = [...items];
	const wlist = WriteonlyList<T>(arr.length);
	const length = wlist.length;

	const subs = new Set<ListUpdateSubscriber<T>>();
	const defered = new Set<Unsubscriber>();
	const defer = (d: Unsubscriber): void => void defered.add(d);

	const listenToUpdates = (sub: ListUpdateSubscriber<T>) => {
		if (subs.size === 0) start();
		subs.add(sub);
		return () => {
			subs.delete(sub);
			if (subs.size === 0) stop();
		};
	};

	const start = () => {
		defer(
			wlist.listenToUpdates((updates) => {
				for (const u of updates) {
					switch (u.type) {
						case "modify":
							arr[u.index] = u.value;
							break;

						case "delete":
							arr.splice(u.index, 1);
							break;

						case "insert":
							arr.splice(u.index, 0, u.value!);
							break;

						case "move":
							const [item] = arr.splice(u.fromIndex, 1);
							arr.splice(u.toIndex, 0, item);
							break;
					}
				}
				if (arr.length !== wlist.length.get())
					console.error(
						`Length mismatch. Real: ${
							arr.length
						}, reported: ${wlist.length.get()}`,
					);

				for (const s of subs) s(updates);
			}),
		);
		opts.onStart?.({ defer });
	};

	const stop = () => {
		for (const d of defered) d();
		defered.clear();
		opts.onStop?.();
	};

	const toWriteonly = () => wlist;
	const popAt = (index: number) => {
		const item = arr.at(index);
		wlist.deleteAt(index);
		return item;
	};
	const pop = () => popAt(-1);
	const shift = () => popAt(0);

	const getAt = (index: number) => {
		if (subs.size === 0) {
			start();
			stop();
		}
		return arr.at(index);
	};

	const rlist = List.fromMinimal({ getAt, listenToUpdates, length });
	const toReadonly = () => rlist;

	const self: MutList<T> = {
		...rlist,
		...wlist,
		length,
		listenToUpdates,
		toWriteonly,
		toReadonly,
		pop,
		shift,
		popAt,
	};

	return self;
};
