import type { Component, Mountable } from "./types.ts";
import type { Signal } from "../signals";

export interface HtmlProps {
	tag: Signal<keyof HTMLElementTagNameMap>;
	children?: Mountable<any>[];
	[props: string]: any;
}
export interface HtmlContext {
	htmlParent: HTMLElement;
}

export const Html: Component<HtmlProps, HtmlContext> = ({
	tag,
	children,
	...props
}: HtmlProps) => ({
	mount(ctx: HtmlContext) {
		let removeElement = () => {};
		let disposeEl: Array<() => void> = [];

		const unsubTag = tag.subscribe(($tag) => {
			// clean old element
			removeElement();
			disposeEl.forEach((u) => u());

			// create new element
			const el = document.createElement($tag);
			removeElement = () => el.remove();

			// assign props and events
			for (const [attr, val] of Object.entries(props)) {
				const eventMatch = attr.match(/^on([A-Z])(.*)$/);

				if (eventMatch) {
					const eventName =
						eventMatch[1].toLowerCase() + eventMatch[2];

					const callback = (e: any) => val.set(e);
					el.addEventListener(eventName, callback);
					disposeEl.push(() =>
						el.removeEventListener(eventName, callback),
					);
				} else {
					el.setAttribute(attr, val);
				}
			}

			// mount children
			const childContext = { ...ctx, htmlParent: el };
			for (const child of children ?? []) {
				disposeEl.push(child.mount(childContext));
			}

			// mount into dom
			ctx.htmlParent.appendChild(el);
		});

		return () => {
			unsubTag();
			removeElement();
			disposeEl.forEach((u) => u());
		};
	},
});
