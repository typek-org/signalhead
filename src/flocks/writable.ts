import { toPipable, type PipeOf } from "@typek/typek";
import { type StartStop, mut } from "../mod.ts";
import { Defer } from "../utils/defer.ts";
import { Flock, type FlockUpdateSubscriber } from "./readable.ts";
import { WriteonlyFlock } from "./writeonly.ts";

export interface MutFlockOptions extends StartStop {}

/**
 * A reactive counterpart to `Set<T>`.
 *
 * **Unstable:** This API is experimental and subject
 * to change in future versions. If you use it, please
 * [provide feedback](https://github.com/m93a/signalhead/issues)!
 * We're especially interested in your use cases, and
 * what inconveniences you ran into while using it.
 */
export interface MutFlock<T>
	extends WriteonlyFlock<T>,
		Omit<Flock<T>, "pipe">,
		PipeOf<MutFlock<T>> {
	toReadonly(): Flock<T>;
	toWriteonly(): WriteonlyFlock<T>;
}

export const MutFlock = <T>(
	items: Iterable<T> = [],
	opts: MutFlockOptions = {},
): MutFlock<T> => {
	const set = new Set(items);
	const wflock = WriteonlyFlock<T>();
	const size = mut(0);

	const subs = new Set<FlockUpdateSubscriber<T>>();
	const { defer, cleanup } = Defer.create();

	const listenToUpdates = (sub: FlockUpdateSubscriber<T>) => {
		if (subs.size === 0) start();
		subs.add(sub);
		return () => {
			subs.delete(sub);
			if (subs.size === 0) stop();
		};
	};

	const start = () => {
		defer(
			wflock.listenToUpdates((updates) => {
				for (const u of updates) {
					switch (u.type) {
						case "add":
							set.add(u.value);
							break;

						case "delete":
							set.delete(u.value);
							break;

						case "clear":
							set.clear();
							break;
					}
				}
				if (set.size !== size.get()) {
					size.set(set.size);
				}
				for (const s of [...subs]) s(updates);
			}),
		);
		opts.onStart?.({ defer });
	};

	const stop = () => {
		cleanup();
		opts.onStop?.();
	};

	const rflock = Flock.fromMinimal({
		listenToUpdates,
		size,
		has(v) {
			return set.has(v);
		},
		iter() {
			return set;
		},
	});

	const toWriteonly = () => wflock;
	const toReadonly = () => rflock;

	return toPipable({ ...wflock, ...rflock, toWriteonly, toReadonly });
};
