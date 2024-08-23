import { fn } from "../utils/testUtils.ts";
import { ScannedSignal } from "./scan.ts";
import { mut } from "./writable.ts";

Deno.test("scan", () => {
	Deno.test("basic", () => {
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

				const f = fn<void, [number]>();
				const u1 = sum.subscribe((x) => f(x));
				f.assertCalledOnce([1]);

				const g = fn<void, [number]>();
				const u2 = prod.subscribe((x) => g(x));
				f.assertNotCalled();
				g.assertCalledOnce([1]);

				n.set(3);
				f.assertCalledOnce([4]);
				g.assertCalledOnce([3]);

				n.set(8);
				f.assertCalledOnce([12]);
				g.assertCalledOnce([24]);

				u1();
				u2();
				n.set(10);
				f.assertNotCalled();
				g.assertNotCalled();
			}
		}
	});
});
