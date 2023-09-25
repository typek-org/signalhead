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
});
