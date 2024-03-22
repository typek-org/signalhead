import { Signal, derived, mut } from "../mod.ts";
import { fn } from "../utils/testUtils.ts";

describe("derived", () => {
	test("basic", () => {
		const num1 = mut(10);
		const num2 = mut(8);

		const gcd = derived(($) => {
			let [a, b] = [$(num1), $(num2)];
			while (b !== 0) [a, b] = [b, a % b];
			return a;
		});

		const f = fn<void, [number]>();
		const u = gcd.subscribe((x) => f(x));

		f.assertCalledOnce([2]);
		expect(gcd.get()).toBe(2);

		num1.set(12);
		f.assertCalledOnce([4]);

		u();
		num1.set(36);
		num2.set(24);
		expect(gcd.get()).toBe(12);
		f.assertNotCalled();
	});

	test("nested", () => {
		const condition = mut(true);
		const a = mut(42);

		const addTwo = (s: Signal<number>) => derived(($) => $(s) + 2);

		const b = derived(($) => {
			if ($(condition)) return 69;
			else return $(addTwo(a)) - 2;
		});

		expect(b.get()).toBe(69);
		condition.set(false);
		expect(b.get()).toBe(42);
		condition.set(true);

		const f = fn<void, [number]>();
		b.subscribe((x) => f(x));
		f.assertCalledOnce([69]);

		condition.set(false);
		f.assertCalledOnce([42]);
	});

	test("nested function call", () => {
		const a = mut<number>(69);
		const b = (s: Signal<number>) => derived(($) => 1000 + $(s));

		let loopCounter = 0;
		const c = (s: Signal<number>) =>
			derived(($) => {
				if (loopCounter++ > 10) throw "Stuck in a loop :c";
				return 1000 + $(b(s));
			});

		const d = c(a);

		const f = fn<void, [number]>();
		d.subscribe((x) => f(x));
		f.assertCalledOnce([2069]);

		a.set(42);
		f.assertCalledOnce([2042]);
	});
});
