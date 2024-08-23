import { cons } from "./cons.ts";
import { Signal } from "./readable.ts";
import type {
	Validator,
	Invalidator,
	MinimalSignal,
	MinimalSubscriber,
	Unsubscriber,
} from "./types.ts";

export type FlatSignal<Signal, Depth extends number> = {
	done: Signal;
	recur: Signal extends MinimalSignal<infer InnerSignal>
		? FlatSignal<
				InnerSignal,
				// prettier-ignore
				[ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ][Depth]
			>
		: Signal;
}[Depth extends -1 ? "done" : "recur"];

export const FlatSignal: <S, D extends number = 1>(
	signal: S,
	depth?: D,
) => Signal<FlatSignal<S, D>> = (
	signal: unknown,
	depth?: number,
): any => {
	depth ??= 1;

	if (!Signal.isReadable(signal)) return cons(signal);

	if (depth <= 0) {
		return Signal.fromMinimal(signal);
	}

	if (depth === 1) {
		return ShallowFlatSignal(signal);
	}

	return FlatSignal(ShallowFlatSignal(signal), depth - 1);
};

const ShallowFlatSignal = <T>(
	signal: MinimalSignal<MinimalSignal<T> | T>,
): Signal<T> => {
	let value: T;
	let unsubOuter = () => {};
	let unsubInner = () => {};
	let outerValid = true;
	let innerValid = true;
	let changedWhileDirty = false;

	const isValid = () => outerValid && innerValid;

	const subs = new Set<MinimalSubscriber<T>>();
	const invs = new Set<Invalidator>();
	const vals = new Set<Validator>();

	const callSubs = () => {
		for (const s of [...subs]) s(value);
	};
	const callInvs = () => invs.forEach((i) => i());
	const callVals = () => vals.forEach((v) => v());
	const silentlyValidateAll = () => {
		innerValid = true;
		outerValid = true;
		changedWhileDirty = false;
	};
	const setOuter = (v: T) => {
		silentlyValidateAll();
		value = v;
		callSubs();
	};
	const setInner = (v: T) => {
		innerValid = true;
		if (isValid()) {
			value = v;
			callSubs();
		} else {
			changedWhileDirty = true;
			value = v;
		}
	};
	const invalidateOuter = () => {
		const shouldCallInvs = isValid();
		outerValid = false;
		if (shouldCallInvs) callInvs();
	};
	const invalidateInner = () => {
		const runInvs = isValid();
		innerValid = false;
		if (runInvs) callInvs();
	};
	const validateOuter = () => {
		outerValid = true;

		if (isValid()) {
			if (changedWhileDirty) setOuter(value);
			else callVals();
		}
	};
	const validateInner = () => {
		innerValid = true;
		if (isValid()) callVals();
	};

	const start = () => {
		unsubOuter = signal.subscribe(
			(v) => {
				unsubInner();
				if (Signal.isReadable(v)) {
					silentlyValidateAll();
					unsubInner = v.subscribe(
						setInner,
						invalidateInner,
						validateInner,
					);
				} else {
					unsubInner = () => {};
					setOuter(v);
				}
			},
			invalidateOuter,
			validateOuter,
		);
	};

	const stop = () => {
		unsubOuter();
		unsubOuter = () => {};
	};

	const subscribe = (
		s: MinimalSubscriber<T>,
		i?: Invalidator,
		v?: Validator,
	): Unsubscriber => {
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
			let v = Signal.get(signal);
			if (Signal.isReadable(v)) {
				v = Signal.get(v);
			}
			value = v!;
		}
		return value;
	};

	return Signal.fromMinimal({ subscribe, get });
};
