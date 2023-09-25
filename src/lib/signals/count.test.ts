import { CountedSignal } from "./count.ts";
import { mut } from "./writable.ts";

describe("tap", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const a = mut("hello");
			const b = method ? a.count() : CountedSignal(a);

			const f = jest.fn<void, [number]>();
			const u = b.subscribe((x) => f(x));
			expect(f).toBeCalledTimes(1);
			expect(f).lastCalledWith(0);

			a.set("world");
			expect(f).toBeCalledTimes(2);
			expect(f).lastCalledWith(1);

			expect(b.get()).toEqual(1);

			a.set("end of transmission");
			expect(f).toBeCalledTimes(3);
			expect(f).lastCalledWith(2);

			u();
			a.set("beep boop");
			expect(f).toBeCalledTimes(3);
			expect(b.get()).toEqual(3);
		}
	});
});
