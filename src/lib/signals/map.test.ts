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

			const f = jest.fn<void, [string]>();
			const u = comma.subscribe((x) => f(x));
			expect(f).toBeCalledTimes(1);
			expect(f).lastCalledWith("Hello, world!");

			orig.set("sup kidz");
			expect(f).toBeCalledTimes(2);
			expect(f).lastCalledWith("Sup, kidz!");
			expect(comma.get()).toBe("Sup, kidz!");

			u();
			orig.set("shh silence");
			expect(comma.get()).toBe("Shh, silence!");
			expect(f).toBeCalledTimes(2);
		}
	});

	test("get in the middle of updating gives the correct value", () => {
		const a = mut("hey");
		const b = a.map((s) => s.toUpperCase());

		const f = jest.fn<void, [string, string]>();
		const g = jest.fn<void, [string, string, string]>();

		a.subscribe((s) => f(s, a.get()));
		b.subscribe((s) => g(s, b.get(), a.get().toUpperCase()));

		expect(f).toBeCalledTimes(1);
		expect(f).toHaveBeenLastCalledWith("hey", "hey");
		expect(g).toBeCalledTimes(1);
		expect(g).toHaveBeenLastCalledWith("HEY", "HEY", "HEY");

		a.set("bye");
		expect(f).toBeCalledTimes(2);
		expect(f).toHaveBeenLastCalledWith("bye", "bye");
		expect(g).toBeCalledTimes(2);
		expect(g).toHaveBeenLastCalledWith("BYE", "BYE", "BYE");
	});
});
