import { Signal } from "./readable.ts";
import type {
	Invalidator,
	MinimalSignal,
	MinimalSubscriber,
	SubscriberParams,
	Validator,
} from "./types.ts";

export const FilteredSignal: {
	<T>(
		signal: MinimalSignal<T>,
		fn: (value: T, params: SubscriberParams<T>) => boolean,
	): Signal<T | undefined>;
	<T>(
		signal: MinimalSignal<T>,
		fn: (value: T, params: SubscriberParams<T>) => boolean,
		initialValue: T,
	): Signal<T>;
} = <T>(
	signal: MinimalSignal<T>,
	fn: (value: T, params: SubscriberParams<T>) => boolean,
	initialValue?: T,
): Signal<T | undefined> => {
	const subs = new Set<MinimalSubscriber<T | undefined>>();
	const invs = new Set<Invalidator>();
	const vals = new Set<Validator>();
	let unsub = () => {};
	let value = initialValue;
	let valid = true;

	const invalidate = () => {
		if (valid) {
			valid = false;
			invs.forEach((i) => i());
		}
	};
	const validate = () => {
		if (!valid) {
			valid = true;
			vals.forEach((v) => v());
		}
	};

	const start = () => {
		unsub = Signal.fromMinimal(signal).subscribe(
			(v, params) => {
				if (fn(v, params)) {
					value = v;
					valid = true;
					subs.forEach((s) => s(value));
				} else {
					validate();
				}
			},
			invalidate,
			validate,
		);
	};
	const stop = () => {
		value = initialValue;
		unsub();
		unsub = () => {};
	};

	const subscribe = (
		s: MinimalSubscriber<T | undefined>,
		i?: Invalidator,
		v?: Validator,
	) => {
		if (subs.size === 0) start();

		subs.add(s);
		if (i) invs.add(i);
		if (v) vals.add(v);

		s(value);

		return () => {
			subs.delete(s);
			if (i) invs.delete(i);
			if (v) vals.delete(v);
			if (subs.size === 0) stop();
		};
	};

	const get = () => {
		if (subs.size === 0) {
			start();
			stop();
		}
		return value;
	};

	return Signal.fromMinimal({ subscribe, get });
};
