import { type Mountable } from "./types.ts";
import { cons, type Signal } from "../signals";
import {
	HtmlAttributesTagNameMap,
	HtmlTagName,
} from "./html-types.ts";

export type HtmlProps<T extends HtmlTagName> =
	HtmlAttributesTagNameMap[T] & {
		tag: Signal<T>;
		children?: Mountable<any>[];
	};

export interface HtmlContext {
	htmlParent: HTMLElement;
}

export const Html = <T extends HtmlTagName>({
	tag,
	children,
	self,
	...props
}: HtmlProps<T>): Mountable<HtmlContext> => ({
	mount(ctx: HtmlContext) {
		return tag.subscribe(($tag, { defer }) => {
			// create new element
			const el = document.createElement($tag as string);
			defer(() => el.remove());

			// assign props and events
			for (let [attr, val] of Object.entries(props)) {
				const eventMatch = attr.match(/^on([A-Z].*)$/);

				if (eventMatch) {
					const eventName = eventMatch[1].toLowerCase();

					const callback = (e: any) => val.set(e);
					el.addEventListener(eventName, callback);
					defer(() => el.removeEventListener(eventName, callback));
				} else {
					if (attr === "httpEquiv") attr = "http-equiv";
					attr = attr.toLowerCase();
					el.setAttribute(attr, val);
				}
			}

			// mount children
			const childContext = { ...ctx, htmlParent: el };
			for (const child of children ?? []) {
				defer(child.mount(childContext));
			}

			// mount into dom
			ctx.htmlParent.appendChild(el);

			// update self
			self?.set(el as any);
		});
	},
});

const tag =
	<T extends HtmlTagName>(t: T) =>
	(props: Omit<HtmlProps<T>, "tag"> = {} as any) =>
		Html<T>({ ...props, tag: cons(t) } as HtmlProps<T>);

export const a = tag("a");
export const abbr = tag("abbr");
export const address = tag("address");
export const area = tag("area");
export const article = tag("article");
export const aside = tag("aside");
export const audio = tag("audio");
export const b = tag("b");
export const base = tag("base");
export const bdi = tag("bdi");
export const bdo = tag("bdo");
export const big = tag("big");
export const blockquote = tag("blockquote");
export const body = tag("body");
export const br = tag("br");
export const button = tag("button");
export const canvas = tag("canvas");
export const caption = tag("caption");
export const cite = tag("cite");
export const code = tag("code");
export const col = tag("col");
export const colgroup = tag("colgroup");
export const data = tag("data");
export const datalist = tag("datalist");
export const dd = tag("dd");
export const del = tag("del");
export const details = tag("details");
export const dfn = tag("dfn");
export const dialog = tag("dialog");
export const div = tag("div");
export const dl = tag("dl");
export const dt = tag("dt");
export const em = tag("em");
export const embed = tag("embed");
export const fieldset = tag("fieldset");
export const figcaption = tag("figcaption");
export const figure = tag("figure");
export const footer = tag("footer");
export const form = tag("form");
export const h1 = tag("h1");
export const h2 = tag("h2");
export const h3 = tag("h3");
export const h4 = tag("h4");
export const h5 = tag("h5");
export const h6 = tag("h6");
export const head = tag("head");
export const header = tag("header");
export const hgroup = tag("hgroup");
export const hr = tag("hr");
export const html = tag("html");
export const i = tag("i");
export const iframe = tag("iframe");
export const img = tag("img");
export const input = tag("input");
export const ins = tag("ins");
export const kbd = tag("kbd");
export const keygen = tag("keygen");
export const label = tag("label");
export const legend = tag("legend");
export const li = tag("li");
export const link = tag("link");
export const main = tag("main");
export const map = tag("map");
export const mark = tag("mark");
export const menu = tag("menu");
export const menuitem = tag("menuitem");
export const meta = tag("meta");
export const meter = tag("meter");
export const nav = tag("nav");
export const noscript = tag("noscript");
export const object = tag("object");
export const ol = tag("ol");
export const optgroup = tag("optgroup");
export const option = tag("option");
export const output = tag("output");
export const p = tag("p");
export const param = tag("param");
export const picture = tag("picture");
export const pre = tag("pre");
export const progress = tag("progress");
export const q = tag("q");
export const rp = tag("rp");
export const rt = tag("rt");
export const ruby = tag("ruby");
export const s = tag("s");
export const samp = tag("samp");
export const slot = tag("slot");
export const script = tag("script");
export const section = tag("section");
export const select = tag("select");
export const small = tag("small");
export const source = tag("source");
export const span = tag("span");
export const strong = tag("strong");
export const style = tag("style");
export const sub = tag("sub");
export const summary = tag("summary");
export const sup = tag("sup");
export const table = tag("table");
export const template = tag("template");
export const tbody = tag("tbody");
export const td = tag("td");
export const textarea = tag("textarea");
export const tfoot = tag("tfoot");
export const th = tag("th");
export const thead = tag("thead");
export const time = tag("time");
export const title = tag("title");
export const tr = tag("tr");
export const track = tag("track");
export const u = tag("u");
export const ul = tag("ul");
export const htmlVar = tag("var");
export const video = tag("video");
export const wbr = tag("wbr");
