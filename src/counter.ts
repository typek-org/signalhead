import { cons, mut } from "./lib/signals/";
import {
	Component,
	DomText,
	If,
	p,
	button,
	br,
	strong,
	span,
} from "./lib/components";

export const Counter = Component(() => {
	const onClick = mut<MouseEvent>();
	const count = onClick.count();
	const text = count.map((c) => `count it ${c}`);
	const isEven = count.map((c) => c % 2 === 0);

	return p({
		children: [
			button({
				onClick,
				children: [DomText({ text })],
			}),
			br(),
			If({
				cond: isEven,
				then: strong({
					children: [DomText({ text: cons("The number is even") })],
				}),
				else: span({
					children: [DomText({ text: cons("The number is odd") })],
				}),
			}),
		],
	});
});
