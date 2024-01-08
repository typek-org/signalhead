import { Signal } from "./readable";
import { MinimalSignal, MinimalWritableSignal } from "./types";
import { WritableSignal } from "./writable";
import { ZippedSignal } from "./zip";

export interface SignalWithDefault<T> extends Signal<T> {
	default: Signal<T>;
}

export interface WritableSignalWithDefault<T>
	extends Omit<
			WritableSignal<T>,
			"withMappedSetter" | "withSetterSideEffect"
		>,
		SignalWithDefault<T> {
	default: WritableSignal<T>;

	toReadonly(): SignalWithDefault<T>;

	set(value: T | undefined): void;
	update(fn: (value: T) => T | undefined): void;
}

export const SignalWithDefault = <T>(
	optional: MinimalSignal<T | undefined>,
	defaultValue: MinimalSignal<T>,
): SignalWithDefault<T> => {
	const combined = ZippedSignal(optional, defaultValue).map(
		([opt, def]) => opt ?? def,
	);

	return {
		...combined,
		default: Signal.fromMinimal(defaultValue),
	};
};

export const WritableSignalWithDefault = <T>(
	optional: MinimalWritableSignal<T | undefined>,
	defaultValue: MinimalWritableSignal<T>,
): WritableSignalWithDefault<T> => {
	const writable = WritableSignal.fromMinimal(optional);
	const combined = SignalWithDefault(optional, defaultValue);
	const toReadonly = () => combined;

	return {
		...writable,
		...combined,

		default: WritableSignal.fromMinimal(defaultValue),
		toReadonly,
		update(fn) {
			optional.set(fn(Signal.get(combined)));
		},
	};
};
