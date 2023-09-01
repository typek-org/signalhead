import { DomText, Html, type HtmlContext } from "./lib/html";
import { cons, writableSignal } from "./lib/signals";
import type { Component } from "./lib/types";

export const Counter: Component<{}, HtmlContext> = () => ({
	mount(ctx) {
		let count = writableSignal(0);
		let clickEvent = writableSignal<MouseEvent>();
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
