import { fn } from "../utils/testUtils.ts";
import { EnumeratedSignal } from "./enumerate.ts";
import { mut } from "./writable.ts";

describe("tap", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const a = mut("hello");
			const b = method ? a.enumerate() : EnumeratedSignal(a);

			const f = fn<void, [[number, string]]>();
			const u = b.subscribe((x) => f(x));
			f.assertCalledOnce([[0, "hello"]]);

			a.set("world");
			f.assertCalledOnce([[1, "world"]]);

			expect(b.get()).toEqual([1, "world"]);

			a.set("end of transmission");
			f.assertCalledOnce([[2, "end of transmission"]]);

			u();
			a.set("beep boop");
			f.assertNotCalled();
			expect(b.get()).toEqual([3, "beep boop"]);
		}
	});
});
