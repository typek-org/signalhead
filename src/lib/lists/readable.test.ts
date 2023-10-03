import { mut } from "../mod.ts";
import { List } from "./readable.ts";

describe("List", () => {
	test("basic derived list", () => {
		const n = mut(3);
		const str = mut("world");
		const list = List<number | string>(1, 2, n, "hello", str);

		expect(list.toArray().get()).toEqual([1, 2, 3, "hello", "world"]);

		n.set(4);
		str.set("joe");
		expect(list.toArray().get()).toEqual([1, 2, 4, "hello", "joe"]);
	});
});
