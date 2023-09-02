import type { Component } from "./types.ts";
import type { Signal } from "../signals";
import type { HtmlContext } from "./html.ts";

export interface DomTextProps {
	text: Signal<string>;
}

export const DomText: Component<DomTextProps, HtmlContext> = ({
	text,
}) => ({
	mount({ htmlParent }) {
		let removeNode = () => {};

		const unsub = text.subscribe(($text) => {
			// remove old node
			removeNode();

			// create new node
			const node = document.createTextNode($text);
			removeNode = () => node.remove();

			// mount into dom
			htmlParent.appendChild(node);
		});

		return () => {
			unsub();
			removeNode();
		};
	},
});
