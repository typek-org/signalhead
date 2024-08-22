import { mut } from "../mod.ts";
import { Pack } from "./readable.ts";

describe("Pack", () => {
	test("basic derived pack", () => {
		const n = mut(3);
		const str = mut("world");
		const pack = Pack<number | string>(1, 2, n, "hello", str);

		expect(pack.toArray().get()).toEqual([1, 2, 3, "hello", "world"]);

		n.set(4);
		str.set("joe");
		expect(pack.toArray().get()).toEqual([1, 2, 4, "hello", "joe"]);
	});
});
