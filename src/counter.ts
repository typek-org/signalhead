import { cons, mut } from "./lib/signals/";
import { Component, Html, DomText } from "./lib/components";

export const Counter = Component(() => {
	const onClick = mut<MouseEvent>();
	const count = onClick.enumerate().map(([i]) => i);
	const text = count.map((c) => `count it ${c}`);

	return Html({
		tag: cons("button"),
		onClick,
		children: [DomText({ text })],
	});
});
