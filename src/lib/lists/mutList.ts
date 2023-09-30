import { WritableSignal } from "../mod.ts";
import { List } from "./list.ts";
import { WriteonlyList } from "./writeonlyList.ts";

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

export const MutList = <T>(items: Iterable<T> = []): MutList<T> => {
	const arr = [...items];
	const wlist = WriteonlyList<T>(arr.length);
	const { length, listenToUpdates } = wlist;

	listenToUpdates((updates) => {
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
		console.log(arr);
		if (arr.length !== length.get())
			console.error(
				`Length mismatch. Real: ${
					arr.length
				}, reported: ${length.get()}`,
			);
	});

	const toWriteonly = () => wlist;
	const popAt = (index: number) => {
		const item = arr.at(index);
		wlist.deleteAt(index);
		return item;
	};
	const pop = () => popAt(-1);
	const shift = () => popAt(0);

	const getAt = (index: number) => {
		return arr.at(index);
	};

	const rlist = List.fromMinimal({ getAt, listenToUpdates, length });
	const toReadonly = () => rlist;

	const self: MutList<T> = {
		...rlist,
		...wlist,
		toWriteonly,
		toReadonly,
		pop,
		shift,
		popAt,
	};

	return self;
};
