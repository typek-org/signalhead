import { type Mountable } from "./types.ts";
import type { Signal } from "../signals";
import { AttributesTagNameMap, TagName } from "./html-types.ts";

export type HtmlProps<T extends TagName> = AttributesTagNameMap[T] & {
	tag: Signal<T>;
	children?: Mountable<any>[];
};

export interface HtmlContext {
	htmlParent: HTMLElement;
}

export const Html = <T extends TagName>({
	tag,
	children,
	self,
	...props
}: HtmlProps<T>): Mountable<HtmlContext> => ({
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
			for (let [attr, val] of Object.entries(props)) {
				const eventMatch = attr.match(/^on([A-Z].*)$/);

				if (eventMatch) {
					const eventName = eventMatch[1].toLowerCase();

					const callback = (e: any) => val.set(e);
					el.addEventListener(eventName, callback);
					disposeEl.push(() =>
						el.removeEventListener(eventName, callback),
					);
				} else {
					if (attr === "httpEquiv") attr = "http-equiv";
					attr = attr.toLowerCase();
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

			// update self
			self?.set(el);
		});

		return () => {
			unsubTag();
			removeElement();
			disposeEl.forEach((u) => u());
		};
	},
});
