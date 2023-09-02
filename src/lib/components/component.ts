import type { Component as Component_, Mountable } from "./types.ts";

export interface ComponentMethods {
	defer(destructor: () => void): void;
}

export type Component<Props, Context> = Component_<Props, Context>;
export const Component =
	<Props = {}, Context = {}>(
		render: (
			props: Props,
			methods: ComponentMethods,
		) => Mountable<Context>,
	): Component<Props, Context> =>
	(props: Props): Mountable<Context> => {
		return {
			mount(ctx) {
				const destructors: Array<() => void> = [];
				const defer = (fn: () => void) => destructors.push(fn);

				const output = render(props, { defer });
				defer(output.mount(ctx));

				return () => {
					while (destructors.length > 0) destructors.pop()!();
				};
			},
		};
	};
