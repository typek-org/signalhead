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

	const doubled = count.map((c) => 2 * c);
	const doubledText = count
		.zip(doubled)
		.map(([c, d]) => `The number ${c} doubled is ${d}.`);

	const aggregate = count.scan<number[]>((r, x) => [...r, x], []);
	const sum = aggregate.map((arr) => arr.reduce((a, b) => a + b));
	const aggregateStr = aggregate.map(
		(arr) => `${arr.join(" + ")} = ${sum.get()}`,
	);

	return p({
		children: [
			button({
				onClick,
				children: [DomText({ text })],
			}),
			br(),
			p({
				children: [DomText({ text: doubledText })],
			}),
			p({
				children: [DomText({ text: aggregateStr })],
			}),
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
