import { cons, mut } from "./lib/signals/";
import type { Component, HtmlContext } from "./lib/components/";
import { Html, DomText } from "./lib/components";

export const Counter: Component<{}, HtmlContext> = () => ({
	mount(ctx) {
		const clickEvent = mut<MouseEvent>();
		const count = clickEvent.enumerate().map(([i]) => i);

		const button = Html({
			tag: cons("button"),
			onClick: clickEvent,
			children: [
				DomText({ text: count.map((c) => `count it ${c}`) }),
			],
		});

		return button.mount(ctx);
	},
});
