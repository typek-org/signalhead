import type { Signal } from "../../signals";
import type { Mountable } from "../types";

export interface IfProps<Context> {
	cond: Signal<boolean>;
	then: Mountable<Context>;
	else?: Mountable<Context>;
}

export const If = <Context>({
	cond,
	then,
	else: else_,
}: IfProps<Context>): Mountable<Context> => ({
	mount(ctx) {
		let unmount: (() => void) | undefined;
		const unsub = cond.subscribe(($cond) => {
			unmount?.();
			unmount = $cond ? then.mount(ctx) : else_?.mount(ctx);
		});

		return () => {
			unsub();
			unmount?.();
		};
	},
});
