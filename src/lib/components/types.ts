import {
	type MinimalSignal,
	type WriteonlySignal,
	type MinimalWritableSignal,
	Signal,
	cons,
} from "../signals";

export type InProp<T> = MinimalSignal<T> | T;
export type OutProp<T> = WriteonlySignal<T>;
export type InOutProp<T> = MinimalWritableSignal<T>;

export const coerceToSignal = <T>(x: InProp<T>) => {
	if (typeof x === "object" && x !== null && "subscribe" in x) {
		return Signal.fromMinimal(x);
	} else {
		return cons(x);
	}
};

export const isInOutProp = (x: any): x is InOutProp<any> =>
	"subscribe" in x &&
	typeof x.subscribe === "function" &&
	"set" in x &&
	typeof x.set === "function";

export const isOutProp = (x: any): x is OutProp<any> =>
	!("subscribe" in x) && "set" in x && typeof x.set === "function";

export type Component<Props, Context> = (
	props: Props,
) => Mountable<Context>;

export interface Mountable<Context> {
	mount(context: Context): () => void;
}
