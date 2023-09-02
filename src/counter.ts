import { cons, mut } from "./lib/signals/";
import type { Component, HtmlContext } from "./lib/components/";
import { Html, DomText } from "./lib/components";

export const Counter: Component<{}, HtmlContext> = () => ({
	mount(ctx) {
		let count = mut(0);
		let clickEvent = mut<MouseEvent>();

		const unsub = clickEvent.subscribe(() => {
			count.update((c) => c + 1);
		});

		const button = Html({
			tag: cons("button"),
			onClick: clickEvent,
			children: [
				DomText({ text: count.map((c) => `count it ${c}`) }),
			],
		});

		const unmount = button.mount(ctx);

		return () => {
			unmount();
			unsub();
		};
	},
});
