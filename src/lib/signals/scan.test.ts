import { ScannedSignal } from "./scan.ts";
import { mut } from "./writable.ts";

describe("scan", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			for (const init of [true, false]) {
				const n = mut(1);

				const sum = method
					? init
						? n.scan((a, b) => a + b, 0)
						: n.scan((a, b) => a + b)
					: init
					? ScannedSignal(n, (a, b) => a + b, 0)
					: ScannedSignal(n, (a, b) => a + b);

				const prod = method
					? init
						? n.scan((a, b) => a * b, 1)
						: n.scan((a, b) => a * b)
					: init
					? ScannedSignal(n, (a, b) => a * b, 1)
					: ScannedSignal(n, (a, b) => a * b);

				const f = jest.fn<void, [number]>();
				const u1 = sum.subscribe((x) => f(x));
				expect(f).toBeCalledTimes(1);
				expect(f).lastCalledWith(1);

				const g = jest.fn<void, [number]>();
				const u2 = prod.subscribe((x) => g(x));
				expect(f).toBeCalledTimes(1);
				expect(f).lastCalledWith(1);

				n.set(3);
				expect(f).toBeCalledTimes(2);
				expect(f).lastCalledWith(4);
				expect(g).toBeCalledTimes(2);
				expect(g).lastCalledWith(3);

				n.set(8);
				expect(f).toBeCalledTimes(3);
				expect(f).lastCalledWith(12);
				expect(g).toBeCalledTimes(3);
				expect(g).lastCalledWith(24);

				u1();
				u2();
				n.set(10);
				expect(f).toBeCalledTimes(3);
				expect(g).toBeCalledTimes(3);
			}
		}
	});
});
