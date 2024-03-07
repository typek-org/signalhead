import { Signal, Subscriber, Unsubscriber } from "../mod";
import { Flock } from "./readable";
import { MutFlock, MutFlockOptions } from "./writable";

export interface FlockRegistry<T> extends Flock<T> {
	register(s: Signal<T>): Unsubscriber;
}

export const FlockRegistry = <T>(
	opts: MutFlockOptions = {},
): FlockRegistry<T> => {
	let live = false;
	const multiset = new Map<T, number>();

	const add = (v: T) => {
		const currCount = multiset.get(v) ?? 0;
		multiset.set(v, currCount + 1);
		if (currCount === 0) wflock.add(v);
	};
	const del = (v: T) => {
		const currCount = multiset.get(v) ?? 0;
		switch (currCount) {
			case 0:
				return;
			case 1:
				multiset.delete(v);
				wflock.delete(v);
				return;
			default:
				multiset.set(v, currCount - 1);
		}
	};

	const signals = new Set<Signal<T>>();
	const defered = new Set<Unsubscriber>();
	const defer = (d: Unsubscriber): void => void defered.add(d);

	const sub: Subscriber<T> = (currValue, { oldValue }) => {
		add(currValue);
		del(oldValue!);
	};

	const onStart = () => {
		live = true;
		for (const s of signals) {
			defer(s.subscribe(sub));
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
		if (live) defer(s.subscribe(sub));

		return () => signals.delete(s);
	};

	const wflock = MutFlock<T>([], { onStart, onStop });

	return {
		...wflock.toReadonly(),
		register,
	};
};
