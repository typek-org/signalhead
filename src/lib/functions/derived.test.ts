import { derived, mut } from "../mod.ts";
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
});
