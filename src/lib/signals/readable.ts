import { EnumeratedSignal } from "./enumerate.ts";
import { MappedSignal } from "./map.ts";
import type { MinimalSignal, Signal as Signal_ } from "./types.ts";

export type Signal<T> = Signal_<T>;
export const Signal = {
	fromMinimal<T>({ subscribe, get }: MinimalSignal<T>): Signal<T> {
		get ??= () => {
			let value: T | undefined;
			subscribe((val) => (value = val))();
			return value;
		};

		const map = <S>(fn: (value: T) => S) =>
			MappedSignal({ subscribe, get }, fn);

		const enumerate = () => EnumeratedSignal({ subscribe, get });

		return { subscribe, get, map, enumerate };
	},
};
