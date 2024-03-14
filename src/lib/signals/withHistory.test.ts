import { SignalWithHistory } from "./withHistory.ts";
import { mut } from "./writable.ts";

describe("withHistory", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const a = mut(42);
			const b = method ? a.withHistory(3) : SignalWithHistory(a, 3);
			a.set(69);

			const f = jest.fn<void, [[number, number, number]]>();
			const u = b.subscribe((x) => f(x));
			expect(f).toBeCalledTimes(1);
			expect(f).lastCalledWith([69, 69, 69]);

			a.set(-12);
			expect(f).toBeCalledTimes(2);
			expect(f).lastCalledWith([-12, 69, 69]);

			a.set(420);
			expect(f).toBeCalledTimes(3);
			expect(f).lastCalledWith([420, -12, 69]);

			a.set(3);
			expect(f).toBeCalledTimes(4);
			expect(f).lastCalledWith([3, 420, -12]);

			u();

			a.set(69);
			expect(f).toBeCalledTimes(4);

			b.subscribe((x) => f(x));
			expect(f).toBeCalledTimes(5);
			expect(f).lastCalledWith([69, 69, 69]);
		}
	});
});
