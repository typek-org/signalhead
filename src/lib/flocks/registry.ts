import {
	PipeOf,
	Signal,
	Subscriber,
	Unsubscriber,
	pipableOf,
} from "../mod.ts";
import { Flock, FlockUpdate } from "./readable.ts";
import { MutFlock, MutFlockOptions } from "./writable.ts";

export interface FlockRegistry<T>
	extends Omit<Flock<T>, "pipe">,
		PipeOf<FlockRegistry<T>> {
	register(s: Signal<T>): Unsubscriber;
}

export const FlockRegistry = <T>(
	opts: MutFlockOptions = {},
): FlockRegistry<T> => {
	let live = false;
	const multiset = new Map<T, number>();

	const createAddUpdates = (value: T): FlockUpdate<T>[] => {
		const currCount = multiset.get(value) ?? 0;
		multiset.set(value, currCount + 1);
		if (currCount === 0) return [{ type: "add", value }];
		return [];
	};
	const createDeleteUpdates = (value: T): FlockUpdate<T>[] => {
		const currCount = multiset.get(value) ?? 0;
		switch (currCount) {
			case 0:
				return [];
			case 1:
				multiset.delete(value);
				return [{ type: "delete", value }];
			default:
				multiset.set(value, currCount - 1);
				return [];
		}
	};

	const signals = new Set<Signal<T>>();
	const defered = new Set<Unsubscriber>();
	const defer = (d: Unsubscriber): void => void defered.add(d);

	const createSub = (): Subscriber<T> => {
		let firstRun = true;
		return (currValue, { prev }) => {
			if (firstRun) {
				wflock.update(createAddUpdates(currValue));
				firstRun = false;
			}
			if (currValue === prev) return;
			wflock.update([
				...createAddUpdates(currValue),
				...createDeleteUpdates(prev!),
			]);
		};
	};

	const onStart = () => {
		live = true;
		for (const s of signals) {
			defer(s.subscribe(createSub()));
		}
		opts.onStart?.({ defer });
	};

	const onStop = () => {
		live = false;
		for (const d of defered) d();
		opts.onStop?.();
	};

	const register = (s: Signal<T>) => {
		signals.add(s);
		if (live) defer(s.subscribe(createSub()));

		return () => {
			wflock.update(createDeleteUpdates(s.get()));
			signals.delete(s);
		};
	};

	const wflock = MutFlock<T>([], { onStart, onStop });

	return pipableOf({
		...wflock.toReadonly(),
		register,
	});
};
