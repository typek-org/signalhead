import { ZippedSignal } from "./zip.ts";
import { mut } from "./writable.ts";

describe("zip", () => {
	test("basic get & subscribe", () => {
		for (const method of [true, false]) {
			const a = mut(1);
			const b = mut(2);

			const c = method ? a.zip(b) : ZippedSignal(a, b);

			a.set(1);
			b.set(2);

			expect(c.get()).toEqual([1, 2]);

			a.set(3);
			expect(c.get()).toEqual([3, 2]);

			const f = jest.fn<void, [[number, number]]>();
			const u = c.subscribe((x) => f(x));

			expect(f).toBeCalledTimes(1);
			expect(f).lastCalledWith([3, 2]);

			a.set(420);
			expect(f).toBeCalledTimes(2);
			expect(f).lastCalledWith([420, 2]);

			b.set(69);
			expect(f).toBeCalledTimes(3);
			expect(f).lastCalledWith([420, 69]);

			u();

			a.set(1);
			b.set(96);
			expect(f).toBeCalledTimes(3);
		}
	});
});
