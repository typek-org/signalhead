import { fn } from "../utils/testUtils.ts";
import { FlatSignal } from "./flat.ts";
import { Signal } from "./readable.ts";
import { mut } from "./writable.ts";

describe("flat", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const inner1 = mut("cat");
			const inner2 = mut("train");
			const outer = mut<
				string | Signal<string> | Signal<Signal<string>>
			>(inner1);

			const flat = method ? outer.flat() : FlatSignal(outer);

			const f = fn<void, [string | Signal<string>]>();
			flat.subscribe((x) => f(x));
			f.assertCalledOnce(["cat"]);

			inner1.set("rat");
			f.assertCalledOnce(["rat"]);

			outer.set(inner2);
			f.assertCalledOnce(["train"]);

			inner2.set("brain");
			f.assertCalledOnce(["brain"]);

			inner1.set("bat");
			f.assertNotCalled();

			outer.set("giraffe");
			f.assertCalledOnce(["giraffe"]);

			outer.set(mut(mut("moth")));
			const arg = f.mock.calls[0][0];
			f.assertCalledOnce();

			expect(Signal.isReadable(arg)).toBe(true);
			if (Signal.isReadable(arg)) {
				expect(arg.get()).toBe("moth");
			}
		}
	});

	describe("invalitation and revalidation", () => {
		const inner1 = mut(101);
		const inner2 = mut(202);
		const outer = mut<number | Signal<number>>(inner1);

		let isValid = true;
		const flat = outer.flat();

		const subscriber = fn<void, [number]>(() => (isValid = true));
		const invalidator = () => void (isValid = false);
		const validator = () => void (isValid = true);
		flat.subscribe((x) => subscriber(x), invalidator, validator);

		expect(isValid).toBe(true);
		subscriber.assertCalledOnce([101]);

		it("copies validation of outer", () => {
			outer.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			outer.set(inner1);
			expect(isValid).toBe(true);
			subscriber.assertCalledOnce([101]);

			outer.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			outer.validate();
			expect(isValid).toBe(true);
			subscriber.assertNotCalled();
		});

		it("copies validation of inner", () => {
			inner1.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			inner1.set(102);
			expect(isValid).toBe(true);
			subscriber.assertCalledOnce([102]);

			inner1.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			inner1.validate();
			expect(isValid).toBe(true);
			subscriber.assertNotCalled();
		});

		it("becomes valid when outer changes", () => {
			inner1.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			outer.set(inner2);
			expect(isValid).toBe(true);
			subscriber.assertCalledOnce([202]);
		});

		test("invalidating both inner and outer", () => {
			outer.invalidate();
			expect(isValid).toBe(false);
			inner2.invalidate();
			expect(isValid).toBe(false);
			outer.validate();
			expect(isValid).toBe(false);
			inner2.validate();
			expect(isValid).toBe(true);

			inner2.invalidate();
			expect(isValid).toBe(false);
			outer.invalidate();
			expect(isValid).toBe(false);
			inner2.validate();
			expect(isValid).toBe(false);
			outer.validate();
			expect(isValid).toBe(true);

			subscriber.assertNotCalled();
		});

		test("updating inner while outer is invalid", () => {
			outer.invalidate();
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			inner2.set(203);
			expect(isValid).toBe(false);
			subscriber.assertNotCalled();

			outer.validate();
			expect(isValid).toBe(true);
			subscriber.assertCalledOnce([203]);
		});
	});
});
