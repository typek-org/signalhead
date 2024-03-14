import { fn } from "../utils/testUtils.ts";
import { MappedSignal } from "./map.ts";
import { mut } from "./writable.ts";

describe("map", () => {
	test("basic", () => {
		for (const method of [true, false]) {
			const orig = mut("hello world");

			const toUpper = (x: string) =>
				x[0].toUpperCase() + x.substring(1);
			const upper = method
				? orig.map(toUpper)
				: MappedSignal(orig, toUpper);

			const toExclam = (x: string) => `${x}!`;
			const exclam = method
				? upper.map(toExclam)
				: MappedSignal(upper, toExclam);

			const toComma = (x: string) => x.split(" ").join(", ");
			const comma = method
				? exclam.map(toComma)
				: MappedSignal(exclam, toComma);

			expect(comma.get()).toBe("Hello, world!");

			const f = fn<void, [string]>();
			const u = comma.subscribe((x) => f(x));
			f.assertCalledOnce(["Hello, world!"]);

			orig.set("sup kidz");
			f.assertCalledOnce(["Sup, kidz!"]);
			expect(comma.get()).toBe("Sup, kidz!");

			u();
			orig.set("shh silence");
			expect(comma.get()).toBe("Shh, silence!");
			f.assertNotCalled();
		}
	});

	test("get in the middle of updating gives the correct value", () => {
		const a = mut("hey");
		const b = a.map((s) => s.toUpperCase());

		const f = fn<void, [string, string]>();
		const g = fn<void, [string, string, string]>();

		a.subscribe((s) => f(s, a.get()));
		b.subscribe((s) => g(s, b.get(), a.get().toUpperCase()));

		f.assertCalledOnce(["hey", "hey"]);
		g.assertCalledOnce(["HEY", "HEY", "HEY"]);

		a.set("bye");
		f.assertCalledOnce(["bye", "bye"]);
		g.assertCalledOnce(["BYE", "BYE", "BYE"]);
	});
});
