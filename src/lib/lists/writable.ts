import {
	PipeOf,
	StartStop,
	WritableSignal,
	pipableOf,
} from "../mod.ts";
import { Defer } from "../utils/defer.ts";
import { List, ListUpdateSubscriber } from "./readable.ts";
import { WriteonlyList } from "./writeonly.ts";

export interface MutList<T>
	extends WriteonlyList<T>,
		Omit<List<T>, "pipe">,
		PipeOf<MutList<T>> {
	length: WritableSignal<number>;
	toReadonly(): List<T>;
	toWriteonly(): WriteonlyList<T>;

	pop(): T | undefined;
	shift(): T | undefined;
	popAt(index: number): T | undefined;

	// sort(fn: (a: T, b: T) => number): this;
	// sortNumerically(fn?: (v: T) => number): this;
}

export interface MutListOptions extends StartStop {}

export const MutList = <T>(
	items: Iterable<T> = [],
	opts: MutListOptions = {},
): MutList<T> => {
	const arr = [...items];
	const wlist = WriteonlyList<T>(arr.length);
	const length = wlist.length;

	const subs = new Set<ListUpdateSubscriber<T>>();
	const { defer, cleanup } = Defer.create();

	const listenToUpdates = (sub: ListUpdateSubscriber<T>) => {
		if (subs.size === 0) start();
		subs.add(sub);
		return pipableOf(() => {
			subs.delete(sub);
			if (subs.size === 0) stop();
		});
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

				for (const s of [...subs]) s(updates);
			}),
		);
		opts.onStart?.({ defer });
	};

	const stop = () => {
		cleanup();
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

	return pipableOf({
		...rlist,
		...wlist,
		length,
		listenToUpdates,
		toWriteonly,
		toReadonly,
		pop,
		shift,
		popAt,
	});
};
