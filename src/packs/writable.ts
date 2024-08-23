import { type PipeOf, toPipable } from "@typek/typek";
import type { StartStop, WritableSignal } from "../mod.ts";
import { Defer } from "../utils/defer.ts";
import { Pack, type PackUpdateSubscriber } from "./readable.ts";
import { WriteonlyPack } from "./writeonly.ts";

/**
 * A reactive counterpart to `Array<T>`.
 *
 * **Unstable:** This API is experimental and subject
 * to change in future versions. If you use it, please
 * [provide feedback](https://github.com/m93a/signalhead/issues)!
 * We're especially interested in your use cases, and
 * what inconveniences you ran into while using it.
 */
export interface MutPack<T>
	extends WriteonlyPack<T>,
		Omit<Pack<T>, "pipe">,
		PipeOf<MutPack<T>> {
	length: WritableSignal<number>;
	toReadonly(): Pack<T>;
	toWriteonly(): WriteonlyPack<T>;

	pop(): T | undefined;
	shift(): T | undefined;
	popAt(index: number): T | undefined;

	// sort(fn: (a: T, b: T) => number): this;
	// sortNumerically(fn?: (v: T) => number): this;
}

export interface MutPackOptions extends StartStop {}

export const MutPack = <T>(
	items: Iterable<T> = [],
	opts: MutPackOptions = {},
): MutPack<T> => {
	const arr = [...items];
	const wpack = WriteonlyPack<T>(arr.length);
	const length = wpack.length;

	const subs = new Set<PackUpdateSubscriber<T>>();
	const { defer, cleanup } = Defer.create();

	const listenToUpdates = (sub: PackUpdateSubscriber<T>) => {
		if (subs.size === 0) start();
		subs.add(sub);
		return toPipable(() => {
			subs.delete(sub);
			if (subs.size === 0) stop();
		});
	};

	const start = () => {
		defer(
			wpack.listenToUpdates((updates) => {
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

						case "move": {
							const [item] = arr.splice(u.fromIndex, 1);
							arr.splice(u.toIndex, 0, item);
							break;
						}
					}
				}
				if (arr.length !== wpack.length.get())
					console.error(
						`Length mismatch. Real: ${
							arr.length
						}, reported: ${wpack.length.get()}`,
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

	const toWriteonly = () => wpack;
	const popAt = (index: number) => {
		const item = arr.at(index);
		wpack.deleteAt(index);
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

	const rpack = Pack.fromMinimal({ getAt, listenToUpdates, length });
	const toReadonly = () => rpack;

	return toPipable({
		...rpack,
		...wpack,
		length,
		listenToUpdates,
		toWriteonly,
		toReadonly,
		pop,
		shift,
		popAt,
	});
};
