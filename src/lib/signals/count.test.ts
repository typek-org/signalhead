import { fn } from "../utils/testUtils.ts";
import { CountedSignal } from "./count.ts";
import { mut } from "./writable.ts";

describe("count", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const a = mut("hello");
			const b = method ? a.count() : CountedSignal(a);

			const f = fn<void, [number]>();
			const u = b.subscribe((x) => f(x));
			f.assertCalledOnce([0]);

			a.set("world");
			f.assertCalledOnce([1]);

			expect(b.get()).toEqual(1);

			a.set("end of transmission");
			f.assertCalledOnce([2]);

			u();
			a.set("beep boop");
			f.assertNotCalled();
			expect(b.get()).toEqual(3);
		}
	});
});
