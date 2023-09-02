import { cons, mut } from "./lib/signals/";
import { Component, Html, DomText, If } from "./lib/components";

export const Counter = Component(() => {
	const onClick = mut<MouseEvent>();
	const count = onClick.enumerate().map(([i]) => i);
	const text = count.map((c) => `count it ${c}`);
	const isEven = count.map((c) => c % 2 === 0);

	return Html({
		tag: cons("p"),
		children: [
			Html({
				tag: cons("button"),
				onClick,
				children: [DomText({ text })],
			}),
			Html({ tag: cons("br") }),
			If({
				cond: isEven,
				then: Html({
					tag: cons("strong"),
					children: [DomText({ text: cons("The number is even") })],
				}),
				else: Html({
					tag: cons("span"),
					children: [DomText({ text: cons("The number is odd") })],
				}),
			}),
		],
	});
});
