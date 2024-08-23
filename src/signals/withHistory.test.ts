import { fn } from "../utils/testUtils.ts";
import { SignalWithHistory } from "./withHistory.ts";
import { mut } from "./writable.ts";

Deno.test("withHistory", () => {
	Deno.test("basic", () => {
		for (const method of [true, false]) {
			const a = mut(42);
			const b = method ? a.withHistory(3) : SignalWithHistory(a, 3);
			a.set(69);

			const f = fn<void, [[number, number, number]]>();
			const u = b.subscribe((x) => f(x));
			f.assertCalledOnce([[69, 69, 69]]);

			a.set(-12);
			f.assertCalledOnce([[-12, 69, 69]]);

			a.set(420);
			f.assertCalledOnce([[420, -12, 69]]);

			a.set(3);
			f.assertCalledOnce([[3, 420, -12]]);

			u();

			a.set(69);
			f.assertNotCalled();

			b.subscribe((x) => f(x));
			f.assertCalledOnce([[69, 69, 69]]);
		}
	});
});
