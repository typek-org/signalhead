import type { Component as Component_, Mountable } from "./types.ts";

export interface ComponentMethods {
	defer(destructor: () => void): void;
}

export type ComponentRender<Props, Context> = (
	props: Props,
	methods: ComponentMethods,
) => void | Mountable<Context> | Mountable<Context>[];

export type Component<Props, Context> = Component_<Props, Context>;
export const Component =
	<Props = {}, Context = {}>(
		render: ComponentRender<Props, Context>,
	): Component<Props, Context> =>
	(props: Props): Mountable<Context> => {
		return {
			mount(ctx) {
				const destructors: Array<() => void> = [];
				const defer = (fn: () => void) => destructors.push(fn);

				const output = render(props, { defer });

				if (output) {
					const outArr = Array.isArray(output) ? output : [output];
					outArr.forEach(({ mount }) => defer(mount(ctx)));
				}

				return () => {
					while (destructors.length > 0) destructors.pop()!();
				};
			},
		};
	};
