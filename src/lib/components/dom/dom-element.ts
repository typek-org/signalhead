import { cons } from "../../signals/cons.ts";
import { Signal } from "../../signals/readable.ts";
import {
	MinimalSignal,
	MinimalWritableSignal,
	WriteonlySignal,
} from "../../signals/types.ts";
import {
	coerceToSignal,
	type InOutProp,
	type InProp,
	type Mountable,
	type OutProp,
} from "../types.ts";
import type { DomContext } from "./types.ts";

export interface DomElementProps {
	tag: InProp<string>;
	namespace?: InProp<string | undefined>;
	self?: OutProp<Element>;
	children?: Mountable<any>[];
	[attr: string]:
		| InProp<unknown>
		| OutProp<unknown>
		| InOutProp<unknown>;
}

export const DomElement = ({
	tag,
	namespace,
	children,
	self,
	...props
}: DomElementProps): Mountable<DomContext> => ({
	mount(ctx: DomContext) {
		const { domDocument, domParent, domNextNode } = ctx;

		return coerceToSignal(tag)
			.zip(coerceToSignal(namespace))
			.subscribe(([$tag, $ns], { defer }) => {
				// create new element
				const el =
					$ns === undefined
						? domDocument.createElement($tag)
						: domDocument.createElementNS($tag, $ns);
				defer(() => el.remove());

				// assign props and events
				for (const [prop, signal_] of Object.entries(props)) {
					const signal:
						| MinimalSignal<any>
						| WriteonlySignal<any>
						| MinimalWritableSignal<any> =
						Signal.isReadable(signal_) || Signal.isWritable(signal_)
							? signal_
							: cons(signal_);

					const isIn = Signal.isReadable(signal);
					const isOut = Signal.isWritable(signal);

					// >> Two-way Binding Props <<

					// checked
					if (
						isIn &&
						isOut &&
						prop === "checked" &&
						el instanceof HTMLInputElement
					) {
						let checked = Signal.get(signal);
						if (checked) el.setAttribute("checked", "true");

						defer(
							signal.subscribe((ch) => {
								if (checked !== ch) el.checked = ch;
							}),
						);

						const listener = () => {
							if (checked !== el.checked) {
								checked = el.checked;
								signal.set(checked);
							}
						};
						el.addEventListener("change", listener);
						defer(() => el.removeEventListener("change", listener));

						continue;
					}

					// value
					if (
						isIn &&
						isOut &&
						prop === "value" &&
						(el instanceof HTMLInputElement ||
							el instanceof HTMLSelectElement ||
							el instanceof HTMLTextAreaElement)
					) {
						let value = Signal.get(signal);
						el.setAttribute("value", value);

						defer(
							signal.subscribe((v) => {
								if (value !== v) el.value = v;
							}),
						);

						const listener = () => {
							if (value !== el.value) {
								value = el.value;
								signal.set(value);
							}
						};
						el.addEventListener("change", listener);
						defer(() => el.removeEventListener("change", listener));

						continue;
					}

					// TODO add <detail open> prop

					// >> Output Props <<

					//
					// event
					const eventMatch = prop.match(/^on([A-Z].*)$/);
					if (isOut && eventMatch) {
						const eventName = eventMatch[1].toLowerCase();

						const callback = (e: any) => signal.set(e);
						el.addEventListener(eventName, callback);
						defer(() => el.removeEventListener(eventName, callback));

						continue;
					}

					// TODO add natural size of <image>
					// TODO add files, group and indeterminate of <input>

					// >> Input Props <<

					if (isIn) {
						const value = coerceToSignal(signal);
						let attr = prop;

						if (attr === "httpEquiv") attr = "http-equiv";
						attr = attr.toLowerCase();

						defer(
							value.subscribe((v: any) => el.setAttribute(prop, v)),
						);

						continue;
					}

					console.error(
						`Unknown attribute ${prop} for element <${$tag}>.`,
					);
				}

				// mount children
				const childContext = { ...ctx, domParent: el };
				for (const child of children ?? []) {
					defer(child.mount(childContext));
				}

				// mount into dom
				domParent.insertBefore(el, domNextNode ?? null);

				// update self
				self?.set(el);
			});
	},
});
