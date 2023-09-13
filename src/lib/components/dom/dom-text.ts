import type { Component } from "../types.js";
import type { Signal } from "../../signals/index.js";
import type { DomContext } from "./types.ts";

export interface DomTextProps {
	text: Signal<string>;
}

export const DomText: Component<DomTextProps, DomContext> = ({
	text,
}) => ({
	mount({ domDocument, domParent, domNextNode }) {
		let removeNode = () => {};

		const unsub = text.subscribe(($text) => {
			// remove old node
			removeNode();

			// create new node
			const node = domDocument.createTextNode($text);
			removeNode = () => node.remove();

			// mount into dom
			domParent.insertBefore(node, domNextNode ?? null);
		});

		return () => {
			unsub();
			removeNode();
		};
	},
});
