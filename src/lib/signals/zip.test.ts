import { ZippedSignal } from "./zip.ts";
import { mut } from "./writable.ts";
import { fn } from "../utils/testUtils.ts";
import { expect } from "@std/expect";

Deno.test("zip", () => {
	Deno.test("basic get & subscribe", () => {
		for (const method of [true, false]) {
			const a = mut(1);
			const b = mut(2);

			const c = method ? a.zip(b) : ZippedSignal(a, b);

			a.set(1);
			b.set(2);

			expect(c.get()).toEqual([1, 2]);

			a.set(3);
			expect(c.get()).toEqual([3, 2]);

			const f = fn<void, [[number, number]]>();
			const u = c.subscribe((x) => f(x));

			f.assertCalledOnce([[3, 2]]);

			a.set(420);
			f.assertCalledOnce([[420, 2]]);

			b.set(69);
			f.assertCalledOnce([[420, 69]]);

			u();

			a.set(1);
			b.set(96);
			f.assertNotCalled();
		}
	});

	Deno.test(
		"get in the middle of updating gives the correct value",
		() => {
			const a = mut("hello");
			const b = mut("world");
			const c = a.zip(b);

			const f = fn<void, [string, string]>();
			const g = fn<void, [string, string]>();
			const h = fn<
				void,
				[[string, string], [string, string], [string, string]]
			>();

			a.subscribe((s) => f(s, a.get()));
			b.subscribe((s) => g(s, b.get()));
			c.subscribe((s) => h(s, c.get(), [a.get(), b.get()]));

			f.assertCalledOnce(["hello", "hello"]);
			g.assertCalledOnce(["world", "world"]);
			h.assertCalledOnce([
				["hello", "world"],
				["hello", "world"],
				["hello", "world"],
			]);

			b.set("Frank");
			f.assertNotCalled();
			g.assertCalledOnce(["Frank", "Frank"]);
			h.assertCalledOnce([
				["hello", "Frank"],
				["hello", "Frank"],
				["hello", "Frank"],
			]);

			a.set("bye");
			f.assertCalledOnce(["bye", "bye"]);
			g.assertNotCalled();
			h.assertCalledOnce([
				["bye", "Frank"],
				["bye", "Frank"],
				["bye", "Frank"],
			]);
		},
	);

	Deno.test("invalidation and revalidation", () => {
		const a = mut("foo");
		const b = mut("bar");

		let isValid = true;
		const c = a.zip(b);

		const subscriber = fn<void, [[string, string]]>(
			() => (isValid = true),
		);
		const invalidator = () => {
			isValid = false;
		};
		const validator = () => {
			isValid = true;
		};

		c.subscribe((x) => subscriber(x), invalidator, validator);
		subscriber.assertCalledOnce([["foo", "bar"]]);
		expect(isValid).toBe(true);

		a.invalidate();
		b.set("qux");
		subscriber.assertNotCalled();
		expect(isValid).toBe(false);
		expect(c.get()).toStrictEqual(["foo", "bar"]);

		a.validate();
		subscriber.assertCalledOnce([["foo", "qux"]]);
		expect(isValid).toBe(true);
		expect(c.get()).toStrictEqual(["foo", "qux"]);

		b.invalidate();
		expect(isValid).toBe(false);
		a.invalidate();
		expect(isValid).toBe(false);
		b.validate();
		expect(isValid).toBe(false);
		a.validate();
		expect(isValid).toBe(true);
		subscriber.assertNotCalled();

		a.invalidate();
		a.set("corge");
		expect(isValid).toBe(true);
		subscriber.assertCalledOnce([["corge", "qux"]]);
	});
});
